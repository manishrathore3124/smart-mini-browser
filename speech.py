import speech_recognition as sr
import sounddevice as sd
import scipy.io.wavfile as wav
import numpy as np
import sys
import tempfile
import os

def listen():
    r = sr.Recognizer()
    
    # Record audio
    duration = 5  # seconds
    sample_rate = 16000
    
    print("LISTENING", flush=True)
    recording = sd.rec(int(duration * sample_rate), 
                      samplerate=sample_rate, 
                      channels=1, 
                      dtype='int16')
    sd.wait()
    
    # Save to temp file
    temp_file = tempfile.mktemp(suffix='.wav')
    wav.write(temp_file, sample_rate, recording)
    
    # Recognize
    with sr.AudioFile(temp_file) as source:
        audio = r.record(source)
    
    try:
        text = r.recognize_google(audio)
        print(f"RESULT:{text}", flush=True)
    except sr.UnknownValueError:
        print("ERROR:Could not understand", flush=True)
    except sr.RequestError:
        print("ERROR:Network error", flush=True)
    finally:
        os.remove(temp_file)

listen()