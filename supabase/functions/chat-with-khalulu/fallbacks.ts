
export function getFallbackResponse(message: string): string {
  if (message.toLowerCase().includes('4') && message.toLowerCase().includes('4')) {
    return "Great math question! 4 + 4 = 8. Math is such a wonderful subject - it's like solving puzzles! Would you like to try some more math problems or learn about different mathematical concepts?";
  }
  
  return "Hello! I'm Khalulu, your friendly learning companion. I'm experiencing some technical difficulties right now, but I'm still here to help with your learning journey! What would you like to explore today?";
}
