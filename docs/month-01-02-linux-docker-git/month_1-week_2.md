# Homebrew & Development Tools

## Homebrew

- `brew install <formula|cask>`: This command installs a specific package (formula) or application (cask). Formulas are typically command-line tools or libraries, while casks are graphical applications.

```code
brew install wget # Installs the 'wget' command-line tool
brew install --cask firefox # Installs the Firefox browser
```

- `brew update`: This command updates Homebrew itself, fetching the latest information about available formulas and casks from the Homebrew repositories. It is recommended to run brew update before installing or upgrading packages to ensure you have access to the most recent versions.

```code
brew update
```

- `brew upgrade [formula|cask]`: This command upgrades installed packages to their latest versions. If no specific formula or cask is provided, brew upgrade will attempt to upgrade all outdated installed formulas and casks.

```code
brew upgrade # Upgrades all outdated packages
brew upgrade git # Upgrades only the 'git' package
brew upgrade --cask visual-studio-code # Upgrades only Visual Studio Code
```

- `brew list`: This command lists all formulas and casks currently installed by Homebrew on your system.

```code
brew list # Lists all installed formulas and casks
brew list --formulae # Lists only installed formulas
brew list --cask # Lists only installed casks
```

## Process management

### `ps` (Process Status)

The `ps` command provides a **snapshot** of the currently running processes. It displays information like the Process ID (**PID**), the controlling terminal, CPU time usage, and the command that started the process.

- **Common Use:** Checking which processes are running at a specific moment.
- **Key Options:**
  - `ps aux`: Displays processes for **all users** (`a`), including processes not attached to a terminal (`x`), showing the user, PID, CPU/memory usage, and more (`u`).
  - `ps -ef`: Displays processes in a **full format** (`f`) with hierarchical data, including processes for **every** user (`e`).

### `top` (Table of Processess)

The `top` command provides a **real-time, interactive** view of the system's processes, much like a dynamic task manager. It constantly updates (by default, every few seconds) and shows a summary of system performance, including CPU and memory usage, along with a list of the top consuming processes.

- **Common Use:** Identifying processes that are consuming the most CPU or memory in real-time.
- **Interaction:** While running, you can use keys like `k` (to kill a process) or `q` (to quit).

### `htop`

`htop` is an **enhanced, interactive, and user-friendly** alternative to `top`. It offers a more readable interface, often with color-coding, and allows for easier horizontal and vertical scrolling to view process information. It also makes it simpler to select and act on processes (like killing them) directly within the interface.

- **Common Use:** A more visually intuitive and easier-to-use real-time process manager.
- **Key Feature:** Displays CPU and memory usage as easily understandable **visual meters**.

### `kill`

The `kill` command is used to send a **specific signal** to a process, identified by its **Process ID (PID)**. The most common use is to terminate a process.

- **Syntax:** `kill [signal] [PID]`
- **Key Signals:**
  - **15 (TERM/SIGTERM):** The default signal. Requests a process to **terminate gracefully**, allowing it to clean up before exiting. This is the **preferred** way to stop a process.
  - **9 (KILL/SIGKILL):** Forces a process to **terminate immediately**. The process is not allowed to clean up, and it should be used only when SIGTERM fails.

### `killall`

The `killall` command is used to send a signal to **all processes with a specific name**. Instead of needing to find the PID first (like with `kill`), you specify the command name itself.

- **Syntax:** `killall [signal] [process_name]`
- **Common Use:** Quickly stopping all instances of a program (e.g., stopping all web server processes with `killall httpd`).
