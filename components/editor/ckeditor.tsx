"use client"

import { useState, useCallback } from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { Upload } from "lucide-react"

interface CKEditorComponentProps {
  value: string
  onChange: (data: string) => void
  placeholder?: string
}

// Custom Upload Adapter using API endpoint
class ApiUploadAdapter {
  loader: any

  constructor(loader: any) {
    this.loader = loader
  }

  async upload() {
    const file = await this.loader.file

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Không thể tải ảnh lên")
      }

      const { url } = await response.json()
      return {
        default: url,
      }
    } catch (error: any) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  abort() {
    // Handle abort if needed
  }
}

export function CKEditorComponent({ value, onChange, placeholder }: CKEditorComponentProps) {
  const [uploading, setUploading] = useState(false)

  const handleReady = useCallback((editor: any) => {
    // Configure upload adapter
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return new ApiUploadAdapter(loader)
    }
  }, [])

  return (
    <div className="space-y-2">
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Upload className="h-4 w-4 animate-pulse" />
          <span>Đang tải ảnh lên...</span>
        </div>
      )}
      <div className="border rounded-md [&_.ck-editor__editable]:min-h-[300px]">
        <CKEditor
          editor={ClassicEditor as any}
          data={value}
          onReady={handleReady}
          onChange={(event, editor) => {
            const data = editor.getData()
            onChange(data)
          }}
          config={{
            placeholder,
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "outdent",
              "indent",
              "|",
              "imageUpload",
              "blockQuote",
              "insertTable",
              "mediaEmbed",
              "|",
              "undo",
              "redo",
            ],
            image: {
              toolbar: [
                "imageTextAlternative",
                "toggleImageCaption",
                "imageStyle:inline",
                "imageStyle:block",
                "imageStyle:side",
              ],
            },
          }}
        />
      </div>
    </div>
  )
}
