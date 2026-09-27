# Recording brief: the demonstration call

The homepage phone replays this call as captions. When a recording exists it
plays in sync with those captions, so the recording must follow the transcript
below word for word. Nothing else on the page changes.

## What to record

Two voices, one take each, or one take with both. About two minutes.

- **Agent.** Even, unhurried, clear. Not chirpy, not robotic. It says it is automated in the first sentence and does not pretend otherwise.
- **Caller.** A tenant at 2 a.m. with water coming through the ceiling: awake, worried, cooperative. No shouting.

Room tone quiet. No music. No sound effects. Mono is fine.

## Format

- WAV or FLAC master, 48 kHz, 24-bit if possible; an MP3 at 128 kbps or better for the web.
- One file, both voices, with about 0.8 seconds of silence between turns.
- Peak below -3 dBFS, no clipping.

## Rights

The recording must be cleared for public use on the website for as long as the
site exists. If a voice actor records the caller, get that in writing. If the
agent voice is the production system's own voice, confirm the voice provider's
terms allow publishing a sample.

## The transcript

Each line is one turn. The bracketed note is what the page shows as a chip at
that moment; it is not spoken.

1. **Agent:** Verrazano Pipe and Heat, after-hours line. I'm an automated assistant and I can get a technician moving. What's happening? *[Automated, disclosed]*
2. **Caller:** There's water coming through my kitchen ceiling. A lot of it.
3. **Agent:** Okay. First, is there a shutoff valve you can reach? Usually under the sink, or by the boiler. *[Safety step first]*
4. **Caller:** There's one under the sink. I closed it. It's slowed down.
5. **Agent:** Good. Who am I speaking with?
6. **Caller:** Dana Okafor. *[Name taken]*
7. **Agent:** Thank you, Dana. What's the address?
8. **Caller:** 88 Bay Ridge Avenue, apartment 3. *[Address taken]*
9. **Agent:** And a number to reach you at, in case the technician calls ahead?
10. **Caller:** 718 555 0142. *[Callback number taken]*
11. **Agent:** Water through a ceiling counts as urgent for this business, so I'm texting the on-call technician now. The earliest window is 7:30 to 9 this morning. Does that work? *[Urgent, on-call texted]*
12. **Caller:** Yes. Please.
13. **Agent:** Booked. You'll get a text in a moment with the window and the technician's first name. Keep that valve closed, and put a bucket under the drip if you can. Anything else? *[Booked 7:30 to 9:00]*
14. **Caller:** No. Thank you. *[Confirmation texted]*
15. **Agent:** You're welcome. Someone will be there between 7:30 and 9. *[Saved to CRM]*

## Wiring it in

Drop the file at `assets/demo-call.mp3`. The page's demo script already
reads each transcript line from the disclosure; adding playback means starting
the audio when the demo starts and, optionally, timing each caption to a
timestamp. Supply the per-line start times (seconds) with the recording and the
captions will be aligned to them rather than to reading pace.
