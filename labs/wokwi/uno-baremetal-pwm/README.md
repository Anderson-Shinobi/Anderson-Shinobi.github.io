## License

The original source code (`sketch.ino`), Wokwi circuit definition (`diagram.json`) and laboratory documentation in this directory are released under the **[MIT License](LICENSE)**.

**Copyright © 2026 Anderson Nogueira.** Reuse, modification and redistribution, including commercial use, are permitted under the license terms, provided the copyright and license notice are retained. The license does not grant rights to third-party trademarks, the Wokwi simulator/platform, or the Arduino name and logos.

This license applies **only to this AVR PWM laboratory directory**, not automatically to the entire SHINOBI portfolio or unrelated repositories.

# SHINOBI Interactive Lab — AVR Bare-Metal GPIO + Timer1 PWM

**Status:** [Wokwi project #477357756254868481](https://wokwi.com/projects/477357756254868481) linked. **Simulator digital timing verified from the author's VCD export**: see [measured PWM and D13 evidence](evidence/VCD_VALIDATION.md). Live external project contents and any physical-hardware behavior remain separate checks.

## Hardware

Arduino Uno R3 / ATmega328P @ 16 MHz. **D9/PB1/OC1A** drives an external blue LED through a 220 Ω resistor. The on-board D13/PB5 LED toggles approximately once per second (VCD median GPIO transition spacing: 1.031931 s). The eight-channel virtual logic analyzer measures D9 (channel D0) and D13 (D1), with GND connected.

The LED and resistor make a circuit-level example; Wokwi's resistor/LED model is approximate, not a substitute for power dissipation and signal-integrity measurement on physical hardware.

## Behavior expected from the firmware

- Timer1 Fast PWM, 8-bit mode 5 (TOP=255), prescaler **64**, with non-inverting OC1A on D9.
- Calculated PWM frequency: **16,000,000/(64 × 256) = 976.5625 Hz**.
- OCR1A steps **26 → 128 → 230**, **10.15625% → 50% → 89.84375%** high time measured on the Wokwi VCD (the UART labels 10/50/90% are rounded targets).
- GPIO PB5/D13 toggles each step.
- Raw UART0 registers transmit `OC1A D9 duty target:` messages at 9600 baud.
- No `pinMode`, `digitalWrite`, `analogWrite`, `delay`, `Serial` or dynamic allocation.

**Verification evidence:** D0 measured 976.5625 Hz and 1.024 ms period in the submitted Wokwi VCD; see [VCD_VALIDATION.md](evidence/VCD_VALIDATION.md) and [measurements.csv](evidence/measurements.csv). AVR compilation/static tests remain separate and do not prove the same hardware behavior.

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
- The submitted simulator VCD has been analyzed; reproduce the values using the published methodology and preserve the original capture.
- Optionally add Wokwi CI using a repository secret `WOKWI_CLI_TOKEN`, never a token in client-side HTML or git.
- Record emulator-vs-physical deviations and repeat on a real Arduino Uno.
