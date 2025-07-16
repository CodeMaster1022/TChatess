"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, History, Check, Eye, X, FileUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface FileUploadDialogProps {
  children: React.ReactNode
  onFileSelect: (files: File[]) => void
  uploadedFiles: Array<{
    name: string
    url: string
    uploadedAt: Date
  }>
}

export function FileUploadDialog({ children, onFileSelect, uploadedFiles }: FileUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedHistoryFiles, setSelectedHistoryFiles] = useState<string[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  // const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFileSelect(selectedFiles)
      setOpen(false)
      setSelectedFiles([])
    }
  }

  const handleHistorySelect = () => {
    if (selectedHistoryFiles.length > 0) {
      // Create File objects from selected history files
      const selectedHistoryItems = uploadedFiles.filter(file => selectedHistoryFiles.includes(file.url))
      const files = selectedHistoryItems.map(item => {
        // Create a File object with the name and type from the history item
        const extension = item.name.split('.').pop()?.toLowerCase() || ''
        const type = getFileType(item.name)
        return new File([], item.name, { type })
      })
      onFileSelect(files)
      setOpen(false)
      setSelectedHistoryFiles([])
    }
  }

  const handlePreview = (url: string) => {
    setPreviewUrl(url)
  }

  // const handleDragOver = (e: React.DragEvent) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   setIsDragging(true)
  // }

  // const handleDragLeave = (e: React.DragEvent) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   setIsDragging(false)
  // }

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   setIsDragging(false)
  //   const files = Array.from(e.dataTransfer.files)
  //   setSelectedFiles(files)
  // }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return 'application/pdf'
      case 'doc':
      case 'docx':
        return 'application/msword'
      case 'txt':
        return 'text/plain'
      default:
        return 'application/octet-stream'
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-full sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl font-bold">File Management</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="upload" className="flex items-center gap-2 py-2 sm:py-3 text-xs sm:text-base">
                <FileUp className="h-4 w-4" />
                Upload Files
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 py-2 sm:py-3 text-xs sm:text-base">
                <History className="h-4 w-4" />
                Upload History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-2">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors",
                  "border-muted-foreground/25",
                  "hover:border-primary/50 hover:bg-primary/5"
                )}
                // onDragOver={handleDragOver}
                // onDragLeave={handleDragLeave}
                // onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  <FileUp className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary">Click to upload files</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, TXT up to 5MB
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Select Files
                  </Button>
                </div>
              </div>
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Selected Files</h3>
                    <Badge variant="secondary">{selectedFiles.length} files</Badge>
                  </div>
                  <ScrollArea className="max-h-[160px]">
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg border bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSelectedFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>
            <TabsContent value="history" className="space-y-4 h-[calc(80vh-200px)]">
              {previewUrl ? (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewUrl(null)}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Back to List
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(previewUrl, '_blank')}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Open in New Tab
                    </Button>
                  </div>
                  <div className="flex-1 border rounded-lg overflow-hidden bg-muted/50">
                    <iframe
                      src={previewUrl}
                      className="w-full h-full"
                      title="Document Preview"
                    />
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-full pr-4">
                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted/80 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{file.name}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(file.uploadedAt, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(file.url)}
                              className="gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (selectedHistoryFiles.includes(file.url)) {
                                  setSelectedHistoryFiles(prev => prev.filter(url => url !== file.url))
                                } else {
                                  setSelectedHistoryFiles(prev => [...prev, file.url])
                                }
                              }}
                              className={cn(
                                "gap-1",
                                selectedHistoryFiles.includes(file.url) && "bg-primary/10"
                              )}
                            >
                              {selectedHistoryFiles.includes(file.url) ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Selected
                                </>
                              ) : (
                                "Select"
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload your first document to get started.
                      </p>
                    </div>
                  )}
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedFiles.length > 0) {
                handleUpload()
              } else if (selectedHistoryFiles.length > 0) {
                handleHistorySelect()
              }
            }}
            disabled={selectedFiles.length === 0 && selectedHistoryFiles.length === 0}
            className="gap-2"
          >
            {selectedFiles.length > 0 ? (
              <>
                <Upload className="h-4 w-4" />
                Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Select {selectedHistoryFiles.length} {selectedHistoryFiles.length === 1 ? 'File' : 'Files'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 