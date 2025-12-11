# Homebrew & Development Tools

## Homebrew

The commands brew update and brew upgrade serve different purposes in managing Homebrew packages:

-   `brew update`: This command fetches the latest versions of the "recipes" (formula definitions) for your installed packages from the Homebrew central repository. It does not change the installed software versions. 

-   `brew upgrade`: This command uses the fetched recipes to install the newer versions of your already-installed packages. It is the actual upgrade process that prepares and installs the new software. 

In summary, `brew update` prepares your system for the next upgrade by updating the available versions, while `brew upgrade` performs the actual upgrade of the software.

The differences between Homebrew formulae and casks are as follows:

-   `Formulae`: These are used to install command-line tools and libraries. They are defined in Ruby-based files and are typically for software that can be compiled from source. 

-   `Casks`: These are used to install graphical applications and pre-built binaries. Casks simplify the installation process for applications that come in formats like .dmg or .pkg, allowing users to install them without manual downloading and unpacking. 

Usage: You would use `brew install` for command-line tools and `brew cask install` for GUI applications. 

## Mini Project

### Setup Node.js app với multiple instances

- Step 1: Use nestjs to create nestjs project
- Step 2: Run with 3 instance
    - PORT-3000 INSTANCE_NAME=instance-1 npm start
    - PORT-3001 INSTANCE_NAME=instance-2 npm start
    - PORT-3002 INSTANCE_NAME=instance-3 npm start

### Monitor CPU/memory usage của từng instance
- Step 1: Test instances
```code
# Instance 1
curl http://localhost:3000

# Instance 2
curl http://localhost:3001

# Instance 3
curl http://localhost:3002
```

- Step 2: Use top
```code
ps u | grep node | grep start | grep -v grep
```

### Kill all Node processes với một command
```code
killall node

// or

pkill node
```