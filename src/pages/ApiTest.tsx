import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Upload, Send, Loader2 } from "lucide-react";

interface BureauFiles {
  experian: File | null;
  equifax: File | null;
  transunion: File | null;
}

interface ResponseLog {
  timestamp: Date;
  responseTime: number;
  status: string;
  rawResponse: string;
  bureausSubmitted: string[];
}

const ApiTest = () => {
  const [files, setFiles] = useState<BureauFiles>({
    experian: null,
    equifax: null,
    transunion: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responseLogs, setResponseLogs] = useState<ResponseLog[]>([]);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const startTimeRef = useRef<number>(0);

  const handleFileChange = (bureau: keyof BureauFiles, file: File | null) => {
    if (file && file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    setFiles((prev) => ({ ...prev, [bureau]: file }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    const bureausSubmitted: string[] = [];

    if (files.experian) {
      formData.append("experian", files.experian);
      bureausSubmitted.push("Experian");
    }
    if (files.equifax) {
      formData.append("equifax", files.equifax);
      bureausSubmitted.push("Equifax");
    }
    if (files.transunion) {
      formData.append("transunion", files.transunion);
      bureausSubmitted.push("TransUnion");
    }

    if (bureausSubmitted.length === 0) {
      alert("Please upload at least one PDF");
      return;
    }

    setIsLoading(true);
    setCurrentResponse("");
    startTimeRef.current = Date.now();

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`;
    
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/analyze-report`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseTime = Date.now() - startTimeRef.current;
      
      if (!response.ok) {
        const errorText = await response.text();
        const log: ResponseLog = {
          timestamp: new Date(),
          responseTime,
          status: `Error ${response.status}`,
          rawResponse: errorText,
          bureausSubmitted,
        };
        setResponseLogs((prev) => [log, ...prev]);
        setCurrentResponse(errorText);
        return;
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setCurrentResponse(fullResponse);
        }
      }

      const finalResponseTime = Date.now() - startTimeRef.current;
      
      const log: ResponseLog = {
        timestamp: new Date(),
        responseTime: finalResponseTime,
        status: "Success",
        rawResponse: fullResponse,
        bureausSubmitted,
      };
      setResponseLogs((prev) => [log, ...prev]);

    } catch (error) {
      const responseTime = Date.now() - startTimeRef.current;
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      const log: ResponseLog = {
        timestamp: new Date(),
        responseTime,
        status: "Error",
        rawResponse: errorMessage,
        bureausSubmitted,
      };
      setResponseLogs((prev) => [log, ...prev]);
      setCurrentResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Gemini API Test Page</h1>
          <a href="/" className="text-primary hover:underline">← Back to Home</a>
        </div>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Credit Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["experian", "equifax", "transunion"] as const).map((bureau) => (
                <div key={bureau} className="space-y-2">
                  <Label htmlFor={bureau} className="capitalize text-foreground">
                    {bureau} PDF
                  </Label>
                  <Input
                    id={bureau}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(bureau, e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {files[bureau] && (
                    <p className="text-sm text-muted-foreground">
                      ✓ {files[bureau]?.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit to Gemini API
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Current Response */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Response (Live)
              {isLoading && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  Elapsed: {formatTime(Date.now() - startTimeRef.current)}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                {currentResponse || "No response yet. Submit a PDF to see the raw API response."}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Response History */}
        <Card>
          <CardHeader>
            <CardTitle>Response History ({responseLogs.length} submissions)</CardTitle>
          </CardHeader>
          <CardContent>
            {responseLogs.length === 0 ? (
              <p className="text-muted-foreground">No submissions yet.</p>
            ) : (
              <div className="space-y-4">
                {responseLogs.map((log, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            log.status === "Success" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {log.status}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            Response Time: {formatTime(log.responseTime)}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Bureaus: {log.bureausSubmitted.join(", ")}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <ScrollArea className="h-[200px] w-full rounded-md border p-2 bg-background">
                        <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                          {log.rawResponse}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiTest;
