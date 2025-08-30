---
title: "Java: Index"
pubDate: 2025-07-22
description: "A collection of questions and concepts for the Java programming language."
author: "Alex Leye"
tags: ["java", "programming"]
---

## Contents

# Introduction

Java-specific resources for Java 14+.

# Checked vs. Unchecked Exceptions

## Checked exception
Checked exceptions are enforced by the compiler at compile-time. They must be either caught using try-catch or declared in the method signature using the `throws` keyword.

They extend `Exception` (but not `RuntimeException`).

Examples:
- `IOException`
- `SQLException`
- `ClassNotFoundException`
- `ParseException`

Example implementation:

Here we can declare the exception in the method signature.
```java
public void readFile() throws IOException {
    FileReader file = new FileReader("file.txt");
}
```

Or we can explicitly handle the error in a try-catch block.

```java
try {
    FileReader file = new FileReader("file.txt");
} catch (FileNotFoundException e) {
    System.out.println("File not found");
}
```

## Unchecked exception
These do not explicitly need to be caught or declared. They can occur at runtime and are NOT checked by the compiler. 
All unchecked exceptions extend `RuntimeException`. They usually represent programmatic errors and propagate up the call stack automatically.

Common examples:
- `NullPointerException`
- `ArrayIndexOutOfBoundsException`
- `IllegalArgumentException`
- `NumberFormatException`


# Singletons

A `Singleton` is a design pattern wherein a class appears exactly once in the application lifecycle, and provides a global access to that instance.

Common use cases are for classes that are expensive to instantiate, and only one is needed, such as:
- Database connections
- Logging
- Cache

## Classic implementation
Using a static variable to hold the instance. A private constructor ensures instantiation cannot be done externally.

The classical implementation shown below is NOT thread-safe:

```java
public class Singleton {

    private static Singleton instance;

    // Private constructor prevents external instantiation
    private Singleton() {}

    // One global access point
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

This is not thread-safe because a thread A and thread B can both be in the if-statement of getInstance, both see `null`, and then both create a new instance. To prevent this, we can do the following.

## Thread-safe 1: synchronized method
This implementation works but is _slow_ since the method call has overhead to ensure threads are synchronized every time.

```java
public static synchronized Singleton getInstance() {
    if (instance == null) {
        instance = new Singleton();
    }
    return instance;
}
```

## Thread-safe 2: Double-checked locking (synchronized block)
In this implementation, we move the `synchronized` portion to _only_ the first check (initialisation) so the overhead is only during initial setup, which will be much faster.

```java
public static Singleton getInstance() {
    if (instance == null) {
        synchronized (Singleton.class) {
            if (instance == null) {
                instance = new Singleton();
            }
        }
    }
    return instance;
}
```
Note that we must have BOTH checks for `if (instance == null)`. The first check is outside of synchronisation, and will run after the Singleton has been initialised in the application (99%+ of the time). However, the nested if-statement is crucial to avoid issues during initialisation. It is here that we must be synchronized and check for null.


## Thread-safe 3: Eager initialisation 
Another way to avoid synchronization issues is to eagerly instantiate the Singleton at application runtime. This way, there can be no contention around the instantiation. However, the problem with this approach is that it wastes resources; the singleton will be created regardless of whether it ever gets used.

```java
private static final Singleton instance = new Singleton();

public static Singleton getInstance() {
    return instance;
}
```

## Thread-safe 4: ENUM (Best practice)
Finally, we get to the industry-recommended approach. Enums have a property guarenteed by the JVM, which is that each enum constant is a Singleton. Take the following example:

```java
public enum Color {
    RED,
    GREEN,
    BLUE;
}

// These are always the same instance
Color red1 = Color.RED;
Color red2 = Color.RED;
System.out.println(red1 == red2); // true - same object reference
```

So, using this knowledge, we can achieve a thread-safe, lazy instantiated Singleton by leveraging enums:

```java
public enum Singleton {
    INSTANCE;
}

// Usage - just reference the constant directly
Singleton singleton = Singleton.INSTANCE;
```

So this looks weird since it is quite empty with this trivial example. In practice however, you would have methods on the enum to make it useful. Let's take a database connection example:

```java
public enum DatabaseConnection {
    INSTANCE;
    
    private Connection connection;
    
    // Constructor runs once when INSTANCE is created
    private DatabaseConnection() {
        // Initialize your connection
        this.connection = createConnection();
    }

    private Connection createConnection() {
        // call static method of this util. NOT composition
        return DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/mydb", 
            "admin", 
            "password123"
        );
    }
    
    public Connection getConnection() {
        return connection;
    }
    
    public void executeQuery(String sql) {
        // Use the connection
    }
}

// Usage
DatabaseConnection.INSTANCE.getConnection();
DatabaseConnection.INSTANCE.executeQuery("SELECT * FROM users");
```

Enum constructors are always private, and run once when the enum is first loaded.

# Locks

The `synchronized` keyword works on methods so that only one thread can access at a time. Otherwise you can use `synchronized` on a block of code as well, to ensure the same (use double-checking as explained in the Singlton section). Note that `synchronized` methods intrinsically lock on the object instance (also called the `monitor`), so you can get a Denial-of-Service by external code calling the method and holding the object indefinitely, either by accident or maliciously. To avoid this, we can make use of locks on a plain `private` object within the class and not accessible.

If locking on an Object, make sure it is `final`!

```java
public class MyClass {
    private final Object lock = new Object();
    
    public void method() {
        synchronized(lock) {
            // your code
        }
    }
}
```

Note that the above lock is not `static` because it is instance-level locking, NOT class-level locking. So each instance is treated separate which is what we wanted here.

# Topics

## Core OOP
- encapsulation
    - private, protected, public
- inheritance
- Polymorphism
- Abstraction

## Hashcode and Equals
`==`  compares object references
`.equals()` compares object content (value) and must be overriden properly.
    - E.g. default equals() in Object class is the same as `==` so be aware.

## Abstract Class vs. Interface
Use Abstract class for partial implementations
Use Interfaces for type hierarchies and multiple inheritance

## Java Memory Model

- Stack
    - Stores primitives and object references.
    - Each thread has its own stack.
- Heap
    - Stores actual objects and contents, and is SHARED across threads.


## Garbage Collector
- Garbage Collector (GC)
    - Reclaims unreachable objects from the heap

Note that there can be times where you should set values to null manually to allow the GC to find these. Such as with unallocating values from a List of Array for example when popping it off.

## Covariance vs. Contravariance
- Covariance (? extends T) means the type can vary to a subtype of T. You can read elements as T, but cannot safely insert.
- Contravariance (? super T) means the type can vary to a supertype of T. You can insert T (and its subtypes), but can only read as Object.

The guiding rule is given by Joshua Blosch in 'Effective Java', by the mnemonic: PECS (Producer Extends, Consumer Super).

## Executors over bare Threads

ExecutorService is an abstract wrapper for working with threads. Can use different executors, as well as Futures, Runnable and Callable.
Make sure to call shutdown() and also to awaitTermination if you need blocking until all threads are done. Or you can call get() on the list of Futures if you want to do that instead.

```java
ExecutorService executor = Executors.newFixedThreadPool(4);

for (int i = 0; i < 10; i++) {
    final int value = i; // must be effectively final
    executor.submit(() -> {
        System.out.println("Thread: " + Thread.currentThread().getName() + ", value: " + value);
        m.put(String.valueOf(value), value);
    });
}

executor.shutdown();
executor.awaitTermination(2, TimeUnit.SECONDS);
```
