---
title: Laser Beam AM Radio Station
date: 2026-09-20
author: Nikolai Martin
tags: Photonics, Electronics, Radio, Circuits, Analog, Theory, Modulation, Demodulation
description: Learn about my recent project where I transmitted music via laser beam
image: assets/laser-radio-header.jpg
video: assets/laser-radio/covervideo.mp4
hidden: false
---

## Overview

After learning about how radios, light, and analog circuits work, I thought it would be really cool to make my own radio transmitter and receiver system. I knew that there are regulations on radio waves, so I took this into account and thought it would be cool to transmit music using a different frequency of light—something that I can actually see, unlike radio waves.

I decided that I wanted to somehow use a laser beam to transmit music. I knew how AM radios worked, so I somewhat knew how I would do it at a high level, but I still had to do a lot of research and learn several new concepts, which were all really fascinating to me!

Generally, basic music-over-visible-light systems directly inject audio into a laser or flashlight and receive it with a solar panel or photodiode. The problem with this is that many modern lights flicker at 60-120 Hz, which can turn into audible noise. My goal was to use a carrier wave so I could isolate my signal from environmental noise and amplitude-modulate it using AM-radio techniques.

> [!IMPORTANT]
> **Laser safety:** Never look into a laser beam or aim it at people, animals, vehicles, or aircraft! Use proper eye protection, control any reflections, and keep the beam path contained while aligning and testing the system.

## Demo Video

<video class="article-inline-video" src="assets/laser-radio/demovid.mp4" controls playsinline preload="metadata" data-audio-gain="4" poster="assets/laser-radio/coverForDemo.png" aria-label="Laser radio demonstration video">
  Your browser does not support embedded video.
</video>

Here’s a video of when I first got the system to work. When I cover the beam, the music cuts out, and it plays again when I move my hand out of the way. The beam’s brightness looks completely constant even though there’s actually music changing its intensity—you just can’t see it because the carrier is cycling 8 million times per second!

## High-Level Diagram

![High-level laser radio project poster](articles/laser-am-radio/poster.jpg)

The system follows the same basic path as a conventional AM radio: generate a carrier, modulate it with audio, transmit it, detect it, recover the envelope, and amplify the recovered audio. The main difference is that the carrier controls the intensity of a visible laser beam rather than being sent from an antenna as a radio wave.

## Transmitter and Receiver Schematics

These are the circuit diagrams I designed for this project. I’ll describe each section in more detail in the next two sections.

<figure class="article-diagram article-diagram-wide">
  <div class="article-image-zoom" data-zoom-image="assets/laser-radio/Transmitter.png">
    <img src="assets/laser-radio/Transmitter.png" alt="Complete transmitter schematic">
  </div>
  <figcaption>Transmitter schematic — hover to magnify</figcaption>
</figure>

<figure class="article-diagram article-diagram-wide">
  <div class="article-image-zoom" data-zoom-image="assets/laser-radio/Receiver.png">
    <img src="assets/laser-radio/Receiver.png" alt="Complete receiver schematic">
  </div>
  <figcaption>Receiver schematic — hover to magnify</figcaption>
</figure>

## Building the Transmitter

### Modulate

<div class="article-text-image article-stage-layout">
  <div class="stage-main">
    <div class="text">
      <p>To start, I generate an 8 MHz carrier wave with a crystal oscillator circuit. I used this <a href="https://youtube.com/watch?v=2omcrkrrhoc">great design by KF5OBS</a>. I then mix this carrier with the input audio signal using a 2N2222 transistor mixer circuit I designed. This varies the amplitude of the carrier according to the audio waveform, which is exactly how AM radio stations produce their signal.</p>
    </div>
    <figure class="article-diagram article-stage-schematic">
      <div class="article-image-zoom" data-zoom-image="assets/laser-radio/ModulateSchematic.png"><img src="assets/laser-radio/ModulateSchematic.png" alt="Oscillator and mixer schematic"></div>
      <figcaption>8 MHz oscillator and audio mixer — hover to magnify</figcaption>
    </figure>
  </div>
  <div class="image">
    <img src="assets/laser-radio/PosterModulate.png" alt="Modulate stage of the laser radio">
  </div>
</div>
<figure class="article-diagram article-diagram-wide">
  <div class="article-image-zoom" data-zoom-image="assets/laser-radio/Receiver.png">
    <img src="assets/laser-radio/Receiver.png" alt="Complete receiver schematic">
  </div>
  <figcaption>Receiver schematic — hover to magnify</figcaption>
</figure>
<figure class="article-diagram article-diagram-compact">
  <img src="assets/laser-radio/scope8MHz.png" alt="Oscilloscope showing the nearly perfect 8MHz waveform, generated by my crystal oscillator">
  <figcaption>Oscilloscope showing the nearly perfect 8MHz waveform, generated by my crystal oscillator</figcaption>
</figure>

### Transmit

<div class="article-text-image article-stage-layout">
  <div class="stage-main">
    <div class="text">
    <p>Now that we have the AM wave generated, we have to inject it into the laser. First, we need to power the laser with a constant-current source using an LM317. This protects the laser from current spikes and thermal runaway.</p>
    <p>To inject the AM wave, we can’t just connect it directly to the LM317. This would interfere with the regulator and could cause the laser to flicker, so I use a 10 µH inductor choke to isolate the high-frequency AC signal from the constant-current regulator while still allowing the DC bias current to pass.</p>
    <p>In this configuration, we now have a properly biased laser with the AM wave modulateding the intensity of the beam.</p>
    </div>
    <figure class="article-diagram article-stage-schematic">
      <div class="article-image-zoom" data-zoom-image="assets/laser-radio/TransmitSchematic.png"><img src="assets/laser-radio/TransmitSchematic.png" alt="Constant-current laser driver schematic"></div>
      <figcaption>Constant-current laser driver and modulation input — hover to magnify</figcaption>
    </figure>
  </div>
  <div class="image">
    <img src="assets/laser-radio/PosterTransmit.png" alt="Transmit stage of the laser radio">
  </div>
</div>



### Assembling the Laser

The laser diodes I got didn’t fit properly into the metal can. I don’t have a press fitter, but I do have a 3D printer. I went through three iterations of ring-shaped holders that surrounded the edges of the laser diode and allowed the spring to press it down. This isn’t a great way to do this because the heat won’t transfer perfectly into the metal housing, which could lead to instability.


<figure class="article-diagram article-diagram-compact">
  <img src="assets/laser-radio/3dPrintedLaserDiodeHolders.png" alt="Three iterations of 3D-printed laser diode holders">
  <figcaption>Iterations of the 3D-printed laser diode holder</figcaption>
</figure>
<figure class="article-diagram article-diagram-compact">
  <img src="assets/laser-radio/laserholder.png" alt="Laser Diode in holder">
  <figcaption>Laser Diode in holder</figcaption>
</figure>

A collimating lens then takes the spread-out light emitted by the laser diode and turns it into a nearly parallel beam by using lenses to control the divergence of the light.


## Building the Receiver

### Detect

<div class="article-text-image article-stage-layout">
  <div class="stage-main">
    <div class="text">
    <p>To convert the laser beam back into an electrical signal, I used a reverse-biased photodiode. I then isolated the 8 MHz signal from other RF and environmental noise using an LC tank circuit, which acts as a band-pass filter. I then preamplified the faint signal with an AD8055 op amp. Somehow, I cranked the gain much higher than I expected to work well at 8 MHz, and it sounded great.</p>
    </div>
    <figure class="article-diagram article-stage-schematic">
      <div class="article-image-zoom" data-zoom-image="assets/laser-radio/DetectSchematic.png"><img src="assets/laser-radio/DetectSchematic.png" alt="Photodiode detector and RF preamplifier schematic"></div>
      <figcaption>Photodiode detector, LC filter, and RF preamplifier — hover to magnify</figcaption>
    </figure>
  </div>
  <div class="image">
    <img src="assets/laser-radio/PosterDetect.png" alt="Detect stage of the laser radio">
  </div>
</div>

### Recover

<div class="article-text-image article-stage-layout">
  <div class="stage-main">
    <div class="text">
    <p>With the signal still modulated, I needed to demodulate it and recover the audio. I did this using a traditional diode-RC envelope detector. Similiarly to old AM and crystal radios, I also used a germanium diode to rectify the signal, then a capacitor and resistor to create a time constant that follows the envelope of the carrier, leaving the original audio signal.</p>
    <p>I then used a dual-stage TL072 audio preamplifier and fed that signal into an LM386 to drive a speaker.</p>
    </div>
    <figure class="article-diagram article-stage-schematic">
      <div class="article-image-zoom" data-zoom-image="assets/laser-radio/RecoverSchematic.png"><img src="assets/laser-radio/RecoverSchematic.png" alt="Envelope detector and audio amplifier schematic"></div>
      <figcaption>Envelope detector and audio amplifier — hover to magnify</figcaption>
    </figure>
  </div>
  <div class="image">
    <img src="assets/laser-radio/PosterRecover.png" alt="Recover stage of the laser radio">
  </div>
</div>

## From Breadboard to Perfboard

I built initial prototype using breadboards. I then transfered my design from breadboard to perfboard, which was a challenge. I'm not great at soldering, so I ran into many issues when soldering more complex components like the op amps. I started soldering the receiver first because it was the most straightforward part. I made sure to build everything section by section so I could test each part before moving on. I also decided that I would do my ground and power rails last.

On the transmitter, I started with the 8 MHz oscillator. I first placed the components, then put a towel underneath the perfboard so I could flip it over and do my best to solder everything together.

When I first tested the oscillator, nothing appeared on my scope. I spent a few days trying to figure out why, and I even went over the traces and measured junction voltages. Finally, I tried connecting a resistor from the output to ground, and the oscillator started working.

As I soldered the other sections, I used a Sharpie to mark a box around each section and also mark the ground connections.

<figure class="article-diagram article-diagram-wide">
  <img src="assets/laser-radio/breadToPerf.png" alt="Breadboard (left) to Perfboard (right)">
  <figcaption>Breadboard (left) to Perfboard (right)</figcaption>
</figure>

## Design Considerations and Issues I Encountered

- I used an ESD strap to protect my laser while building. I didn’t have my ESD protection at the Faire, and the laser diode was damaged. I suspect either electrostatic discharge or an extreme voltage spike during startup. Also, make sure not to leave the soldering iron on the photodiode or laser diode pins for too long.
- I needed a constant-current driver, so I decided to use an LM317 with an inductor choke. I found that without the 10 µH inductor, the laser would flicker because the AC signal interfered with the LM317.
- I couldn’t have too much modulation depth on the carrier, or else the peaks and lows of the audio could either overdrive the laser or turn it off. I tried to keep the modulation current around 5 mA peak-to-peak to prevent this.
- Don’t plug in an electrolytic capacitor backwards. One blew up, and it’s loud!
- Don’t use a center-negative DC adapter on a center-positive circuit. I almost fried my transmitter circuit and laser. I got really lucky that *only* one capacitor blew up. It can also be surprisingly hard to notice that a power adapter is center-negative.
- I had to decouple anything connected to the power rail—op amps, transistor stages, laser circuitry, and so on—with 10 µF electrolytic and 100 nF ceramic capacitors in parallel to ground to prevent noise and feedback. Right after the DC barrel jack input, I used a 1000µF electrolytic capacitor and a 100 nF ceramic capacitor to help reduce power-supply hum and noise.
- The laser diode didn’t fit properly—it rattled around—in the metal can, so I modeled and 3D-printed a holder for the spring to push it down.
- I still have some feedback issues, including sporadic "kissing" and "screeching" sounds. I assume the RF preamp is part of what’s causing this.
- I tested three different collimating lenses at different price ranges. The last one I tested created a nearly perfect dot. I listed it in the parts list.
- I found that larger laser-diode housings have better thermal stability, which results in less laser flickering.
- I can’t use cheap green laser pointers because many of them use frequency doubling to turn infrared light into green light. That process does not preserve the high-frequency intensity modulation I need, so I needed to use a direct green laser diode.
- Oscilloscope probing can introduce a lot of 60 Hz and 120 Hz power-grid noise into sensitive parts of the circuit.
- I found that adding a 1× buffer stage after the RF preamp fixed most of the feedback noise issues because it helped reduce loading between stages.

## Testing and Results

I haven’t conducted any formal range or audio-quality tests yet. I can say, though, that the audio sounds very good, perceptibly better than normal AM radio broadcasts. Because I’m not transmitting over the radio spectrum, I’m not restricted by the same channel-bandwidth regulations as an AM broadcast station.

I believe this system could have a good transmission range, possible 50m+, as long as there isn’t too much interference in the air and the laser can be aligned precisely with the receiver.

In the future, I’ll post actual data here regarding sound quality and range capabilities once I finalize the portable design and alignment optics.

## Sharing My Laser Radio at OC Maker Faire

I was thrilled to show off my project at the OC Maker Faire on September 12-13, 2026. It was a busy weekend for me, with the SAT on Saturday morning. Hundreds of curious people came by my booth, ranging from HAM radio operators to company CEOs to makers like myself. I was excited to explain how my project worked. It was really fun to present something I had spent weeks working on to others.

<figure class="article-diagram article-diagram-wide">
  <img src="assets/laser-radio/BoothPhoto.png" alt="Laser radio project booth at OC Maker Faire">
  <figcaption>My laser radio project booth at OC Maker Faire</figcaption>
</figure>

Unfortunately, on the way over on the first day, my laser diode suffered catastrophic optical damage, possibly through electrostatic discharge or an extreme voltage spike on startup. I didn’t have anything working to demonstrate at that point, sadly, but that didn’t stop me. I explained how my project worked, and no one seemed to mind—people even told me that it’s inevitable for things like this to happen at events like Maker Faire.

That night, I quickly rebuilt the laser module from the ground up. On the second day, something happened with my mixer circuit, and the input audio would no longer modulate onto the carrier without producing harsh, indistinguishable noise.

I ended up not having music working for the entire Faire. At least I was still able to show off the cool green laser beam with photo fog and the 8 MHz carrier signal being recovered on the receiver side with an oscilloscope, which was still really cool.

### Common Questions From Maker Faire

#### What are some practical uses for this project?

Free-Space Optical (FSO) Communication Systems like this are already used for communication between satellites and can offer extremely high bandwidth compared with traditional radio systems. You can read more about [free-space optical communication here](https://en.wikipedia.org/wiki/Free-space_optical_communication).

FSO can also be useful for secure communications because the narrow, line-of-sight beam can be much harder to intercept remotely than a radio signal, although it isn’t impossible. Also, conventional Electronic Warfare (EW) systems cannot be used to jam this because they operate at radio frequncies. The signal can also be encrypted and can use wavelengths that are invisible to the naked eye.

If you replace the free-space path with a glass fiber cable, you now have the same basic idea behind one of the most important modern communication technologies: fiber optics!

#### How far can the system transmit and receive?

I haven’t really tested long distances yet. At home, I tested it from about 1.5 meters away. I believe that with the current circuit, I could potentially get 50+ meters.

The biggest issue is that aligning the laser beam with the photodiode is extremely difficult, and it gets even harder the farther away the receiver is. The distance could be extended with better receiver collection optics, more receiver gain, or a more powerful laser that allows for greater modulation depth. All of these options have their own caveats regarding safety, price, and complexity, although they are completely feasible.

#### What are some limitations of this project?

Free-space optical communication is better suited for outer space communications. For terrestrial applications, environmental factors can limit the maximum distance of the beam, including heat, humidity, rain, snow, fog, animals like birds, and basically anything else that can block, scatter, or refract the beam.

Aligning the beam is also difficult, especially as the transmitter and receiver get farther apart. Over very long distances, the curvature of the Earth eventually becomes another limitation to a direct line-of-sight link unless the transmitter and receiver are elevated.

At long distances, the laser beam also spreads because of [beam divergence](https://en.wikipedia.org/wiki/Beam_divergence), causing less optical power to reach the receiver. In the far field, this decrease in received intensity is closely related to the same geometric spreading described by the [inverse-square law of light](https://en.wikipedia.org/wiki/Inverse-square_law).

I learned a lot of great lessons from the very wise people walking around, and I can’t wait to implement their feedback into the project to make it even better.

## What’s Next?

My immediate next step is to fix the mixer circuit. I want to design a mixer that doesn’t load down either signal source and doesn’t feed the 8 MHz carrier back into the audio input.

I then want to switch from a DVD player, which isn’t portable, to a headphone jack that a mobile phone can connect to. This will allow me to play basically any song and make the system much more portable. Another important benefit is that I’ll be able to generate and test specific audio frequencies without burning CDs, allowing me to figure out which audio frequencies work best and where the system starts to become limited.

I also want to finish the project’s enclosure. I’ll cut out holes for the potentiometer, power switches, power input, laser, and photodiode, and make it so the covers can open and close, probably using magnets.

I would also like to add some sort of collection or alignment optics so that it’s easier to align the system and test it at greater distances.

In the future, I might even try to transmit and receive other kinds of data, such as video!

## Schematics, Parts, and References

### Power

- [DC extension, female to male](https://www.amazon.com/dp/B0D28RB1DK)
- [DC barrel jack for breadboard or perfboard](https://www.amazon.com/dp/B09ZBN38FS)
- [High-quality 12.5 V DC wall adapter, center positive](https://www.amazon.com/dp/B00B8860R0)
- [DC barrel splitters](https://www.amazon.com/dp/B01M7N1GOH) — I wanted to use one wall adapter. This isn’t ideal because of the noise it introduces.
- [Rocker switch](https://www.amazon.com/dp/B0CSJTHZHR)

### Main Components

- [Direct 10 mW 515 nm green laser diode](https://www.mouser.com/en/ProductDetail/ams-OSRAM/PLT5-520DB_P)
- [BPW34 photodiode](http://mouser.com/en/ProductDetail/Vishay-Semiconductors/BPW34)
- [AD8055 RF preamplifier](https://www.mouser.com/en/ProductDetail/Analog-Devices/AD8055ANZ)
- [TL072CP audio preamplifier](https://www.amazon.com/dp/B0FH6RYR2W)
- [LM317 adjustable regulator](https://www.amazon.com/dp/B083TX8964)
- [LM386 audio amplifier module](https://www.amazon.com/dp/B00LNACGTY)
- [2N2222 NPN BJT transistor](https://www.amazon.com/dp/B07T61M92G)
- [Germanium diode](https://www.amazon.com/dp/B07Q4J9WMX)
- [10 kΩ logarithmic potentiometer](https://www.amazon.com/dp/B0GL1ZK21C)
- [Large 8 × 12 cm perfboard](https://www.amazon.com/dp/B0FQSNCVJ9)
- [Collimating lens](https://www.amazon.com/dp/B07L4CYZQG)
- [Laser holding can](https://www.amazon.com/dp/B019MZAR7E)

### Phone Compatibility

- [Male-to-male 3.5 mm audio cable](https://www.amazon.com/dp/B01I0SI1SG)
- [USB-C to 3.5 mm female adapter](https://www.amazon.com/dp/B0GJBLXB8Q)
- [3.5 mm jack for PCB](https://www.amazon.com/dp/B008SNZUYC)

### Miscellaneous

- [Photo fog for viewing the laser beam](https://www.amazon.com/dp/B0C31WL3NG)
- [Faraday shield tape](https://www.amazon.com/dp/B0CW9GNVT9)
- [Acrylic rod for a visual waveguide](https://www.amazon.com/dp/B0F4CZY2SP)
- [ESD-protection strap](https://www.amazon.com/HPFIX-Anti-Static-Adjustable-Connection-Eelectronics/dp/B0BVVJJQYL/ref=sr_1_2?crid=1HSZODZM01KYS&dib=eyJ2IjoiMSJ9._eaIwiQcxcB1UFBtD8nxDjfUDQwOnFrRsOxWGSpWE45CgYktRgiSmlzhr_44r1Ww95nTWDnLt0gyjtwge-RtZ6T2HtRlK3qSDrVFCUCLKZcwmySBEB5GltS83rSAavAebazL0KH2A8FirifHyvfd2_wwg_sSmo2Y_WUAOSOBnaUInlWGXnHitTSrmIVuhYKWxh2M7OPR4q3zLUgUURoFrR2JRYR1qZNrROYuYQV_-js.KlupWji8FHRY89c4zarQuwm5BGyjyngIep5NVf_AviU&dib_tag=se&keywords=esd+protection+strap+with+plug&qid=1789954971&sprefix=esd+protection+strap+with+plug%2Caps%2C156&sr=8-2)
- [Green-laser protection glasses](https://www.amazon.com/dp/B07M92ND2L)

### 3D Print Downloads

- [Laser Diode Holder](assets/laser-radio/TO18holder.stl)
- [Covers](assets/laser-radio/Cover.stl)

I will update this article with any new progress or updates. If you have any questions, comments, or suggestions, please feel free to [reach out!](mailto:nikolai.k.martin@gmail.com)
