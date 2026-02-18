'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { MicrophoneIcon } from '@/components/icons'

interface DictationButtonProps {
  onTranscript: (text: string) => void
}

export function DictationButton({ onTranscript }: DictationButtonProps) {
  const [isListening, setIsListening] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  function toggle() {
    const SpeechRecognitionAPI =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null

    if (!SpeechRecognitionAPI) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as SpeechRecognitionResultList)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join(' ')
      onTranscript(transcript)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-colors',
        isListening
          ? 'animate-pulse bg-red-500 hover:bg-red-600'
          : 'bg-gray-950 hover:bg-gray-800',
      )}
      aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
    >
      <MicrophoneIcon className="h-5 w-5" />
    </button>
  )
}
