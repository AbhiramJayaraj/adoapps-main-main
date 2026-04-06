import { GeminiOrchestrator } from "./geminiOrchestrator";

export class VoiceTrainer {
  static speaking = false;

  static async synthesizeAndPlay(text: string) {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1.05;
    utterance.pitch = 1;
    // Try to find a good authoritative voice
    const voices = window.speechSynthesis.getVoices();
    const trainerVoice = voices.find(v => v.name.includes("Google US English") || v.lang === "en-US");
    if (trainerVoice) {
      utterance.voice = trainerVoice;
    }
    
    this.speaking = true;
    utterance.onend = () => { this.speaking = false; };
    window.speechSynthesis.speak(utterance);
  }

  static listenAndAct(): Promise<string> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        reject("Speech recognition not supported");
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        const result = await GeminiOrchestrator.resolveIntent(transcript);
        
        // Very basic act logic: speak the rationale determined by the Orchestrator
        if (result && result.rationale) {
           await this.synthesizeAndPlay(result.rationale);
        } else {
           await this.synthesizeAndPlay("I didn't quite catch that. Could you repeat?");
        }
        resolve(transcript);
      };
      
      recognition.onerror = (e: any) => reject(e);
      recognition.start();
    });
  }
}
