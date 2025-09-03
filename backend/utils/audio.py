import torch
from demucs.apply import apply_model
from demucs.pretrained import get_model
from demucs.audio import AudioFile, save_audio
from pathlib import Path

model = get_model(name='htdemucs_ft')
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def separate_audio(input_path: Path, output_dir: Path) -> dict[str, str]:
    wav = AudioFile(input_path).read(streams=0, samplerate=model.samplerate, channels=model.audio_channels)
    wav = wav.to(device)
    ref = wav.mean(0)
    wav = (wav - ref.mean()) / ref.std()
    
    sources = apply_model(model, wav[None], device=device, progress=True, num_workers=4)[0]
    sources = sources * ref.std() + ref.mean()

    source_names = model.sources
    output_files = {}

    instrumental_track = None

    for i, source in enumerate(sources):
        stem = source_names[i]
        
        if stem == 'vocals':
            save_path = str(output_dir / f"{input_path.stem}_vocals.wav")
            save_audio(source, save_path, samplerate=model.samplerate)
            output_files['vocals'] = f"{input_path.stem}_vocals.wav"
        elif stem in ['drums', 'bass', 'other']:
            if instrumental_track is None:
                instrumental_track = source
            else:
                instrumental_track += source
    
    if instrumental_track is not None:
        save_path = str(output_dir / f"{input_path.stem}_instrumental.wav")
        save_audio(instrumental_track, save_path, samplerate=model.samplerate)
        output_files['instrumental'] = f"{input_path.stem}_instrumental.wav"

    return output_files
