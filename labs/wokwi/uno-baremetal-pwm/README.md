# SHINOBI Interactive Lab — AVR Bare-Metal GPIO + Timer1 PWM

**Status:** source and wiring published for review. No Wokwi project ID or online simulation run is claimed yet.

## Hardware

Arduino Uno R3 / ATmega328P @ 16 MHz. **D9/PB1/OC1A** drives an external blue LED through a 220 Ω resistor. The on-board D13/PB5 LED toggles once per second. The eight-channel virtual logic analyzer measures D9 (channel D0) and D13 (D1), with GND connected.

The LED and resistor make a circuit-level example; Wokwi's resistor/LED model is approximate, not a substitute for power dissipation and signal-integrity measurement on physical hardware.

## Behavior expected from the firmware

- Timer1 Fast PWM, 8-bit mode 5 (TOP=255), prescaler **64**, with non-inverting OC1A on D9.
- Calculated PWM frequency: **16,000,000/(64 × 256) = 976.5625 Hz**.
- OCR1A steps **26 → 128 → 230**, approximately **10.55% → 50.39% → 90.23%** high time, each for one second.
- GPIO PB5/D13 toggles each step.
- Raw UART0 registers transmit `OC1A D9 duty target:` messages at 9600 baud.
- No `pinMode`, `digitalWrite`, `analogWrite`, `delay`, `Serial` or dynamic allocation.

These are **design expectations** pending validation by executing the Wokwi simulation. The repository's compiler/static tests do not assert real-time simulator behavior.

## Run on Wokwi.com (manual first-time import)

1. Open [New Arduino Uno project](https://wokwi.com/projects/new/arduino-uno).
2. Replace the editor's `sketch.ino` with [this sketch](./sketch.ino).
3. Replace `diagram.json` with [this circuit](./diagram.json).
4. Click **Start Simulation**. Confirm LED brightness cycling and the status LED.
5. Open the Serial Monitor (9600 baud) and check the three alternating target labels.
6. Stop simulation to download `shinobi-pwm-capture.vcd`. Use PulseView or another VCD viewer to examine the 976.56 Hz D9 waveform and D13 transitions.
7. Click **Save** in your Wokwi account to obtain a permanent public `https://wokwi.com/projects/<id>` link. Only then should the portfolio add a **Run Simulation** link to this actual project.

The Wokwi editor and public project publishing require access to Wokwi and may have account, plan, or browser constraints.

## Source validation

From the repository root:

```bash
node tests/test_wokwi_lab.cjs
# Optionally compile the sketch's AVR code independently of Arduino:
sudo apt-get install gcc-avr avr-libc
avr-g++ -std=gnu++11 -Os -Wall -Wextra -Werror -mmcu=atmega328p -DF_CPU=16000000UL \
  -x c++ -c labs/wokwi/uno-baremetal-pwm/sketch.ino -o /tmp/shinobi-pwm.o
```

This verifies register-level firmware compilation, **not** a complete simulator run. No credentials or Wokwi CI token are required for these open-source checks.

## Next evidence milestone

- Save a real Wokwi project and add its verified ID to the portfolio.
- Measure period, duty cycle and step durations from a simulator-produced VCD.
- Optionally add Wokwi CI using a repository secret `WOKWI_CLI_TOKEN`, never a token in client-side HTML or git.
- Record emulator-vs-physical deviations and repeat on a real Arduino Uno.
