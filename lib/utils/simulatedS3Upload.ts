export interface SimulatedS3Response {
  success: boolean;
  fileUrl: string;
  fileName: string;
  error?: string;
}

export const simulateS3Upload = async (file: File): Promise<SimulatedS3Response> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        // Create a simulated S3 URL
        const simulatedUrl = `https://simulated-s3-bucket.s3.amazonaws.com/${file.name}`;
        
        resolve({
          success: true,
          fileUrl: simulatedUrl,
          fileName: file.name
        });
      } catch (error) {
        resolve({
          success: false,
          fileUrl: '',
          fileName: file.name,
          error: 'Failed to upload file'
        });
      }
    }, 3000); // Simulate 1 second upload time
  });
}; 