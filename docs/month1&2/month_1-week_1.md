# Terminal & Unix Fundamentals

## Navigation commands

- `cd` (Change Directory):
This command is used to change the current working directory.
  - `cd <directory_name>`: Navigates to the specified directory within the current path.
  - `cd /path/to/directory`: Navigates to an absolute path.
  - `cd ..`: Navigates one level up in the directory hierarchy.
  - `cd ~`: Navigates to the user's home directory.

- `ls` (List):
This command lists the contents of a directory.
  - `ls`: Lists files and directories in the current working directory.
  - `ls -l`: Provides a detailed list with information like permissions, owner, size, and modification date.
  - `ls -a`: Shows all files, including hidden files (those starting with a dot).

- `pwd` (Print Working Directory):
This command displays the absolute path of the current working directory.

- `mkdir` (Make Directory):
This command creates new directories.
  - `mkdir <directory_name>`: Creates a new directory in the current location.
  - `mkdir -p <path/to/new/directory>`: Creates parent directories if they do not exist.

- `rm` (Remove):
This command is used to remove files or directories.
  - `rm <file_name>`: Deletes the specified file.
  - `rm -r <directory_name>`: Recursively deletes a directory and its contents (use with caution).
  - `rm -f <file_name>`: Forces the removal of a file without prompting for confirmation.

- `cp` (Copy):
This command copies files or directories.
  - `cp <source_file> <destination_file>`: Copies a file to a new location or renames it during the copy.
  - `cp -r <source_directory> <destination_directory>`: Recursively copies a directory and its contents.

- `mv` (Move):
This command moves or renames files and directories.
  - `mv <source_file> <destination_file>`: Moves a file to a new location or renames it.
  - `mv <source_directory> <destination_directory>`: Moves a directory to a new location or renames it.

## File operations

- `touch`:
  - Purpose: Primarily used to change a file's access and modification timestamps to the current time.
  - Common Use: A very common use case is to create a new, empty file if it does not already exist.
  - Syntax: `touch filename`

- `cat`:
  - Purpose: Short for "concatenate". It reads data from files and outputs their contents to standard output (usually your terminal screen).
  - Common Use: Quickly displaying the entire content of a small text file, or combining the contents of multiple files into one.
  - Syntax: `cat filename` or `cat file1 file2 > combined_file`

- `less`:
  - Purpose: A pager program that allows you to view the contents of a file one screen (or page) at a time.
  - Common Use: Ideal for viewing large files because it does not load the entire file into memory at once, enabling efficient forward and backward scrolling.
  - Syntax: `less filename`

- `head`:
  - Purpose: Outputs the first few lines of a file.
  - Common Use: Quickly previewing the beginning of a file, such as a log file header or configuration file. By default, it displays the first 10 lines, but you can specify a different number.
  - Syntax: `head filename` or `head -n 25 filename` (to view the first 25 lines)

- `tail`:
  - Purpose: Outputs the last few lines of a file.
  - Common Use: Used to monitor the end of a continuously growing file, such as an active log file. The -f (follow) option is particularly useful for real-time monitoring of new lines as they are appended.
  - Syntax: `tail filename`, `tail -n 5 filename` (to view the last 5 lines), or `tail -f filename` (to follow the file in real-time)

- `open`:
  - Purpose: This command is specific to macOS (or can be aliased in Linux environments) and works similarly to double-clicking a file in a graphical user interface.
  - Common Use: Opens the file with its default associated application (e.g., a text file in a text editor, an image in an image viewer, or a directory in Finder/file manager).
  - Syntax: `open filename` or `open .` (to open the current directory)

## Permissions

Linux file and directory permissions are managed using the chmod and chown commands, with permissions represented by rwx (read, write, execute).

1. `rwx` (Read, Write, Execute) Permissions:

- Read (r): Allows viewing the content of a file or listing the contents of a directory. Represented numerically as 4.
- Write (w): Allows modifying or deleting a file, or creating/deleting files within a directory. Represented numerically as 2.
- Execute (x): Allows running an executable file or script, or entering and navigating into a directory. Represented numerically as 1.

These permissions are assigned to three categories of users:

- Owner (u): The user who owns the file or directory.
- Group (g): The group associated with the file or directory.
- Others (o): All other users on the system.e

2. `chmod` (Change Mode) Command:
The chmod command is used to change file and directory permissions. It can be used in two modes:

- Symbolic Mode: Uses u, g, o, a (all) for user categories and +, -, = for adding, removing, or setting permissions.

```code
  chmod u+rwx file.txt  # Add read, write, execute permissions for the owner
  chmod g-w directory/  # Remove write permission for the group
  chmod a=r file.sh     # Set read-only permissions for all
```

- Numeric (Octal) Mode: Uses a three-digit octal number, where each digit represents the permissions for owner, group, and others, respectively, by summing the numerical values of r, w, and x.

```code
  chmod 755 file.txt  # Owner: rwx (4+2+1), Group: rx (4+1), Others: rx (4+1)
  chmod 644 config.ini # Owner: rw (4+2), Group: r (4), Others: r (4)
```

3. `chown` (Change Owner) Command:

The chown command is used to change the owner and/or group of a file or directory. Changing Owner.

```code
  chown newowner file.txt
```

Changing Group.

```code
  chown :newgroup file.txt
```

Changing Both Owner and Group.

```code
  chown newowner:newgroup file.txt
```

Recursive Change: Use the -R option to change ownership recursively for directories and their contents.

```code
  chown -R newowner:newgroup directory/
```
