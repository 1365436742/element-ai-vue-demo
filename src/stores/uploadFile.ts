import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useFileOperation } from 'element-ai-vue'
import type { FilesUploadErrorParams, FilesUploadItem } from 'element-ai-vue'

export const useUploadFileStore = defineStore('uploadFile', () => {
  const fileList = ref<FilesUploadItem[]>([])
  const mockUpload = (onProgress: (progress: number) => void) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 30
      onProgress(progress)
      if (progress >= 100) {
        onProgress(100)
        clearInterval(interval)
      }
    }, 500)
  }
  const onErrorMessage = ({ message, type }: FilesUploadErrorParams) => {
    alert(type + ' ' + message)
  }
  const onUpload = async (fileUploadItems: FilesUploadItem[]) => {
    for (let i = 0; i < fileUploadItems.length; i++) {
      const element = fileList.value.find((item) => item.fileId === fileUploadItems[i]?.fileId)
      mockUpload((progress) => {
        if (element) {
          element.progress = progress
          if (progress >= 100) {
            element.uploadingStatus = 'success'
            // 这里有cdn链接可以替换掉fileUrl
            // element.fileUrl = "";
          }
        }
      })
    }
  }
  const commonProps = {
    fileSizeLimit: 1, // 10MB
    maxFileLength: 5,
    accept: ['.pdf', '.docx', '.doc', '.png', '.jpg'],
    onUpload,
    onErrorMessage,
  }
  const { handleFileUpload } = useFileOperation(commonProps, fileList)
  return { fileList, commonProps, handleFileUpload }
})
