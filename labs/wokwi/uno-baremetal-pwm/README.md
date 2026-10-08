# SHINOBI Interactive Lab — AVR Bare-Metal GPIO + Timer1 PWM

**Status:** [Wokwi project #477357756254868481](https://wokwi.com/projects/477357756254868481) was linked by the project author. The external URL and its current simulator contents have not been independently checked here; no successful execution or VCD measurement is claimed yet.

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

## Open the shared project on Wokwi

1. Open the author-supplied [SHINOBI AVR Bare-Metal PWM Lab](https://wokwi.com/projects/477357756254868481) project.
2. Click **Start Simulation**, and verify that the LED connected to D9 changes brightness and the onboard D13 LED toggles.
3. Open the Serial Monitor (9600 baud) and check for three alternating target labels.
4. Compare the current Wokwi editor's `sketch.ino` and `diagram.json` against the canonical files stored beside this README. A shared project can diverge from the GitHub version.
5. Stop the simulation to obtain a `.vcd` file (if supported by the Wokwi analyzer). Examine PWM period, duty and GPIO transitions with a VCD viewer such as PulseView.
6. Record the actual observed behavior and any differences from the design expectations before marking the simulation as validated.

If the shared project cannot be opened, create a [new Arduino Uno project](https://wokwi.com/projects/new/arduino-uno) and import [`sketch.ino`](./sketch.ino) and [`diagram.json`](./diagram.json) manually.

The Wokwi editor and project sharing may have account, plan or browser constraints. Never place Wokwi API tokens in website JavaScript.

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

- Confirm the author-supplied Wokwi link opens publicly and that the editor source matches the GitHub files.
- Measure period, duty cycle and step durations from a simulator-produced VCD.
- Optionally add Wokwi CI using a repository secret `WOKWI_CLI_TOKEN`, never a token in client-side HTML or git.
- Record emulator-vs-physical deviations and repeat on a real Arduino Uno.
