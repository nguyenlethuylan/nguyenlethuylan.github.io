---
title: "S004: Big Data Overview and Processing Frameworks"
date: 2026-09-06
categories: [Big Data, Distributed Systems, Hadoop, Spark, Cassandra, Data Engineering]
---

# Understanding Big Data: Storage, Processing, and Key Frameworks

## 1. From Smartphones to Big Data

Think about a normal day for a smartphone user: sending texts, making calls, checking email, taking photos, watching videos, scrolling social media, using Google Maps. Every action creates data: text messages, call logs, email metadata, photo and video files, GPS locations.

Now multiply that by billions of smartphone users worldwide. Add data from IoT sensors, security cameras, bank transactions, and industrial machines. The amount of data created every second is huge, keeps growing, and never slows down.

The problem is: **traditional computer systems (regular databases, a single server, classic data software) were not built to hold or process data at this scale.** A normal SQL database will crash or become too slow when it has to handle petabytes of data coming from millions of sources, in many different formats, in real time.

> **Big Data** is a term for data sets that are so large, so fast-growing, and so varied in format that traditional computer systems and software cannot collect, store, manage, or analyze them properly.

The key point is not just "a lot of data." It is data at a scale that forces a different approach: instead of using one powerful server (scaling up), we use many cheaper servers working together (scaling out).

---

## 2. How Do We Know Data Is "Big Data"?

Not every large data set counts as Big Data. Experts use five criteria, known as the **5 V's**, to decide:

| Factor | Meaning |
|---|---|
| **Volume** | The amount of data is huge, measured in terabytes (TB), petabytes (PB), or even exabytes (EB) |
| **Velocity** | Data is created and needs to be processed continuously, sometimes every second or millisecond |
| **Variety** | Data comes in many forms: structured, unstructured, and semi-structured |
| **Veracity** | How trustworthy and "clean" the data is (no noise, no missing parts, no errors) |
| **Value** | The useful information gained after analyzing the data — data is worthless if it does not lead to insight |

### Example: Hospital Patient Records

A hospital collects patient data every day, mostly entered by hand from patient record forms. Let's apply the 5 V's to this case:

- **Volume**: Thousands of patient records every day, building up over many years, a huge amount of data.
- **Velocity**: New patients, new tests, and new results are updated almost every hour.
- **Variety**: Records include doctor's notes (unstructured text), ID numbers and admin info (structured), MRI images, ECG readings, and lab result files in XML format (semi-structured).
- **Veracity**: Some data is entered wrong, handwriting is hard to read, and some fields are missing — the data needs cleaning before it can be trusted.
- **Value**: The final goal is to use all this data to diagnose the patient as **correctly, quickly, and cheaply as possible** — that is the real "value" behind collecting and analyzing all of it.

**Simple way to remember (from the example):**
- Volume = "how many records?"
- Velocity = "how fast it updates?"
- Variety = "how many kinds? text, images, numbers"
- Veracity = "can this data be trusted?"
- Value = "what useful result comes out in the end?"

---

## 3. The Core Problem: How to Store and Process Big Data

Once data reaches Big Data scale, two big problems appear:

1. **Storage**: A single disk or server cannot hold everything, so we need **distributed storage** data spread across many machines, with the ability to survive failures (if one machine breaks, no data is lost).
2. **Processing**: A single CPU cannot process data fast enough, so we need **distributed computing** breaking work into small pieces and running them in parallel across many machines (a cluster).

This is why the Big Data tool landscape looks the way it does today: some tools focus on storage, some on processing, and — as the next section shows — processing itself splits into two very different philosophies.

---

## 4. Two Ways to Process Big Data: Batch vs Stream

Data never stops flowing, but *how* a system chooses to process that data changes everything about its design. When building Big Data systems, two main approaches emerge: **batch processing** and **stream processing**. Neither one is universally "better" the right choice depends on whether the priority is deep, accurate analysis over time, or immediate action the moment something happens.

- **Batch processing** collects data over a period of time and processes it in large chunks, at scheduled intervals. It fits reports, historical analysis, and any workload where accuracy over a large volume matters more than speed.
- **Stream processing** processes events continuously, the moment they arrive. It is what powers live dashboards, real-time alerts, and instant recommendations.

In short: **batch trades speed for volume and historical accuracy, while stream trades a bit of accuracy for speed and immediacy.** Most real world Big Data systems end up using both, side by side, rather than picking only one.

> **Worth thinking about**: which is actually harder to scale, a batch pipeline that keeps growing with years of historical data, or a real-time stream that can never stop, never fall behind, and must survive failures without losing events? Both come with very different scaling headaches, which is part of why the tool landscape below is so wide.

### 4.1 Batch Processing: Sub-Patterns and Trigger Types

Batch processing is not one single technique — it splits further along two axes: **execution architecture** (how the work is distributed across machines) and **trigger condition** (what actually causes a batch job to start).

**By execution architecture**

- **MapReduce (Divide and Conquer)**: Splits a large dataset into smaller chunks, processes each chunk in parallel across many machines (**Map**), then combines the partial results (**Reduce**), reading and writing to disk between stages. This is the classic architecture behind Hadoop MapReduce (see section 4.3).
  **Use case:** Jobs where fault tolerance matters more than speed — for example, nightly log aggregation across thousands of servers, where a few machine failures should not break the whole job.

- **In-Memory Batch Processing**: Instead of writing intermediate results to disk between every step, data is kept in RAM as much as possible, which can make processing hundreds of times faster. This is how Apache Spark works (see section 4.3).
  **Use case:** Iterative workloads such as training a machine learning model on the same dataset multiple times, where re-reading from disk on every pass would be far too slow.

**By trigger condition**

- **Scheduled / Periodic Batch**: Runs automatically at a fixed point in time — every night at midnight, every weekend, or at the end of every month — regardless of how much data has piled up.
  **Use case:** A daily sales report that finance needs ready every morning at 8 AM, built from the previous day's transactions.

- **Data-Triggered (Volume-Based) Batch**: Ignores the clock entirely — the job fires only once enough data has accumulated, for example after 10 GB of new files or 1 million new records arrive.
  **Use case:** An e-commerce platform that rebuilds its product recommendation index only after enough new user clicks pile up, avoiding wasted runs on tiny amounts of new data.

- **On-Demand / Ad-Hoc Batch** *(added — a third trigger type worth including alongside the two above)*: Runs only when explicitly triggered, either manually by a person or by an external event, such as an upstream pipeline signaling "my job just finished."
  **Use case:** A one-off historical data migration, or a custom report a business team requests only when needed rather than on a recurring schedule.

### 4.2 Stream Processing: Sub-Patterns and Windowing Techniques

Stream processing is harder to break down cleanly because the data never ends. The two most useful ways to split it are by **processing immediacy** (how quickly each record gets handled) and by **windowing technique** (how an endless stream gets sliced into finite chunks for calculation).

**By processing immediacy**

- **True Streaming (Native / Event-at-a-Time Streaming)**: Each record is processed the instant it arrives, one at a time, with latency measured in milliseconds. Apache Flink and Apache Storm are built this way (see section 4.4).
  **Use case:** Fraud detection on credit card transactions, where a suspicious payment must be flagged within milliseconds.

- **Micro-batching**: Still conceptually a stream, but records are grouped into extremely small batches (e.g., every 0.5–1 second) and each group is processed like a tiny batch job. This was the original approach behind Spark Streaming (see section 4.4).
  **Use case:** A live dashboard that refreshes every second — fast enough to feel "real-time" to a human, while simpler to build and operate than true event-at-a-time processing.

**By windowing technique**

Because a stream never ends, it has to be cut into pieces before any aggregation (sum, count, average) makes sense:

| Window Type | How It Slices Time | Example |
|---|---|---|
| **Tumbling (Fixed)** | Fixed-size, non-overlapping intervals | Count clicks from 8:00–8:05, then 8:05–8:10, and so on |
| **Sliding (Hopping)** | Fixed-size intervals that overlap and move forward | Every 1 minute, recompute a total over the last 5 minutes |
| **Session** | Groups by continuous user activity; closes after a gap of inactivity | Group a user's clicks into one "session" until they go idle for 30 minutes |
| **Global** *(added)* | One single window over the whole stream, with no automatic time-based boundary | A running total that only closes when a manual trigger says "produce a result now" |

- **Tumbling Window — Use case:** Generating a per-5-minute traffic report for a website, where each interval is counted exactly once with no overlap.
- **Sliding Window — Use case:** A "trending now" feature that needs a fresh view of "the last 5 minutes" every minute, so results feel continuously up to date.
- **Session Window — Use case:** Measuring how long a user actively shops on an e-commerce site in one visit, without a fixed time boundary cutting their session in half.
- **Global Window — Use case:** Accumulating a running total across an entire stream (e.g., total signups since launch), where the application — not the clock — decides when to emit a result.

> **Note**: Windows can also be defined by *count* instead of time (a **count-based window**, e.g., "recompute after every 100 events") — less common in production than time-based windows above, but useful when the event arrival rate is unpredictable.

### 4.3 Batch Processing Tools

#### Hadoop MapReduce
The original distributed batch engine, part of the Hadoop ecosystem. It splits work into three stages. Map (transform), Shuffle (group by key), and Reduce (aggregate), reading and writing to disk between each stage.

**Advantages**
- Extremely fault-tolerant, thanks to data replication in HDFS
- Runs on cheap, ordinary hardware, no expensive servers needed
- Mature and proven at massive scale, with decades of production use

**Disadvantages**
- Slow, due to heavy disk I/O between every processing stage
- Not suitable for real-time or iterative workloads (e.g., machine learning training loops)
- Verbose and complex to program directly, usually needs Hive/Pig on top

**Use case**
- Large-scale, one-off historical log processing and legacy batch ETL jobs in existing Hadoop environments

#### Apache Spark
A distributed, in-memory engine built to fix MapReduce's speed problem. Spark represents data as RDDs or DataFrames, builds a DAG of transformations, and evaluates them lazily, keeping data in RAM between steps whenever possible.

**Advantages**
- 10–100x faster than MapReduce for many workloads, thanks to in-memory computing
- One unified engine for batch, SQL, machine learning, and graph processing
- Friendly, mature APIs in Python, Scala, Java, and R

**Disadvantages**
- Needs significant RAM, which raises infrastructure cost at large scale
- Cluster and memory tuning can get complex to manage well
- Still writes to disk when data does not fit in memory, losing some of its speed advantage

**Use case**
- General-purpose ETL, large-scale analytics, and machine learning pipelines — the default choice for most new batch workloads today

#### Apache Hive
A SQL-like query layer sitting on top of HDFS or other storage. Hive translates familiar SQL statements into MapReduce or Spark jobs behind the scenes, organizing data into tables and partitions.

**Advantages**
- Lets analysts use familiar SQL instead of writing MapReduce or Spark code by hand
- Integrates smoothly with the wider Hadoop ecosystem
- Good for structured querying and reporting over huge data lakes

**Disadvantages**
- Performance depends entirely on the underlying engine (MapReduce or Spark), so it inherits their limitations
- Not designed for low-latency, interactive queries
- Limited support for updates/deletes compared to a real database

**Use case**
- Ad hoc SQL analytics and scheduled reporting over data stored in HDFS or a data lake

#### Apache Iceberg
An open **table format**, not a processing engine, it makes a data lake behave more like a real database. Iceberg adds schema evolution, time travel, and ACID transactions on top of plain files like Parquet, and can be read by Spark, Trino, or Flink.

**Advantages**
- Adds ACID transactions and safe schema evolution to plain data lake files
- Supports time travel querying data exactly as it looked at a past point in time
- Works across multiple engines (Spark, Trino, Flink), avoiding lock-in to one tool

**Disadvantages**
- Adds operational complexity: metadata management, file compaction, and snapshot cleanup
- Newer technology, so tooling and community support are still maturing compared to established databases

**Use case**
- Large-scale data lakes that need database-like reliability and multi-engine flexibility, without vendor lock-in

#### Delta Lake
Built by Databricks, Delta Lake serves a very similar purpose to Iceberg: it adds ACID transactions, versioning, and time travel on top of a data lake, with deep integration into Spark.

**Advantages**
- ACID transactions and versioning on top of a data lake, same core benefit as Iceberg
- Very smooth, native integration with Spark and the Databricks platform
- Strong built-in performance optimizations (e.g., data skipping, caching) inside Databricks

**Disadvantages**
- Best experience is closely tied to the Databricks platform, even though the format itself is open-sourced
- Less engine-agnostic in practice than Iceberg most tooling and optimizations assume Spark

**Use case**
- Teams already standardized on Spark or Databricks who want reliable, transactional tables on their data lake

### 4.4 Stream Processing Tools

#### Apache Kafka
The most widely used distributed messaging and streaming platform. Producers publish events into "topics," consumers read from those topics, and Kafka stores events durably and in order for a configurable retention period.

**Advantages**
- Extremely high throughput and low latency for moving data between systems
- Durable, ordered event storage with configurable retention — data isn't lost if a consumer is slow or down
- Massive ecosystem and battle-tested at huge scale (used by most large tech companies)

**Disadvantages**
- Not a processing engine itself, it needs a separate tool (Flink, Spark Streaming) to actually transform or analyze data
- Operating and scaling a Kafka cluster well requires real operational expertise

**Use case**
- The central messaging backbone that connects producers and consumers across a streaming architecture

#### Apache Flink
A true stream processing engine, built from the ground up for continuous, event-by-event computation — not micro-batches.

**Advantages**
- Very low latency, processing each event as it arrives
- Strong support for stateful computations and precise event-time handling (important when events arrive out of order)
- Exactly-once processing guarantees, even after failures

**Disadvantages**
- Steeper learning curve than Spark, especially around state management concepts
- Smaller community and ecosystem compared to Spark

**Use case**
- Latency-critical applications such as fraud detection, real-time monitoring, and complex event processing

#### Spark Structured Streaming
Spark's streaming module, letting the same engine used for batch also handle streaming data by treating an incoming stream as a sequence of very small "micro-batches."

**Advantages**
- Same API and engine as Spark batch mode — easy for teams already using Spark
- Simpler mental model than event-by-event systems, with good throughput
- Benefits from Spark's broad ecosystem (SQL, MLlib, connectors)

**Disadvantages**
- Higher latency than true streaming engines like Flink, since it still works in micro-batches rather than per event
- Some advanced streaming features (e.g., very precise event-time handling) are less mature than Flink's

**Use case**
- Teams that want one unified engine for both batch and streaming workloads, without adopting a second specialized tool

#### Apache Storm
One of the earliest distributed stream processing systems, predating both Flink and Spark Streaming. It processes events one at a time with low latency.

**Advantages**
- Simple processing model, low latency
- Mature and stable, one of the longest-running stream processing systems in production

**Disadvantages**
- Fewer built-in features than newer engines, such as advanced state management and exactly-once guarantees
- Increasingly considered legacy technology, with less active development

**Use case**
- Older real-time systems already built on Storm; rarely chosen for new projects today

#### Apache Pulsar
A newer, Kafka-like distributed messaging and streaming platform that separates its storage and messaging layers internally.

**Advantages**
- Kafka-like throughput with built-in multi-tenancy and geo-replication support
- Flexible architecture that can scale storage and messaging independently

**Disadvantages**
- Smaller community and ecosystem than Kafka, so fewer resources and less hiring pool experience
- Less commonly adopted in production, meaning fewer battle-tested reference architectures

**Use case**
- Multi-tenant or geographically distributed streaming systems that need Kafka-like capability with more built-in flexibility

None of these tools, on their own, solve the problem of serving results back to an application instantly. That is the job of a fast storage layer — which is where Apache Cassandra comes in.

---

## 5. Apache Cassandra: The Storage Layer for Fast Access

### What Is Cassandra?
Cassandra is a **distributed NoSQL database** using a wide-column data model. It was first built by Facebook, then became an open-source Apache project. Unlike the tools above, Cassandra is not a batch or stream processing engine — it is designed mainly for **storage**, sitting at the point where processed data needs to be read and written instantly by applications.

### Storage Characteristics
- **Masterless (peer-to-peer) architecture**: there is no "main" node. All nodes are equal and arranged in a **ring topology**, so there is no single point of failure.
- **Data partitioning**: uses consistent hashing to spread data evenly across nodes.
- **Replication**: each piece of data is copied to multiple nodes (usually 3 copies), which can even be spread across multiple data centers.
- **Tunable consistency**: based on the CAP theorem, Cassandra favors **Availability and Partition tolerance (AP)**. It accepts "eventual consistency," meaning data on different nodes may be slightly out of sync for a short time.
- **Fast writes**: data is first written to a commit log (append-only, very fast) and a memtable (in memory), then later flushed to disk as an SSTable. This design makes write operations very fast.

### How Data Is Processed
- Cassandra uses **CQL (Cassandra Query Language)**, which looks like SQL but **does not support JOINs** and has limited support for complex aggregations like arbitrary GROUP BY.
- Tables must be **designed around expected queries first** ("query-first design") — the opposite of traditional SQL design, where you design the data structure first and write queries later.

### Advantages
- Scales almost linearly by adding more nodes (more nodes = more performance).
- Very high write speed, good for data that arrives constantly.
- No single point of failure, so availability is very high.

### Disadvantages
- No support for complex queries (joins, subqueries), so data often has to be duplicated across tables (denormalization).
- Eventual consistency can cause reads to return slightly outdated data.
- Requires careful data modeling up front; hard to change the design later.

### Typical Use Cases
IoT sensor data, real-time chat/messaging data, large-scale product catalogs. Real-world examples: Instagram, Netflix, and Apple use Cassandra for systems that need constant writes and 24/7 availability. In practice, Cassandra is often placed at the *end* of a streaming pipeline — for example, Kafka → Flink → Cassandra — where processed events land and are then served instantly to applications.

---

## 6. Tools at a Glance

### Batch Tools

| Tool | Type | Typical Latency | Best For |
|---|---|---|---|
| Hadoop MapReduce | Processing engine | High (minutes to hours) | Legacy large-scale batch jobs |
| Apache Spark (batch) | Processing engine | Medium (in-memory) | General-purpose batch ETL and analytics |
| Apache Hive | Query layer on top of storage | Depends on the engine underneath | SQL access to data lakes |
| Apache Iceberg | Table format | N/A — a storage layer | Database-like reliability on a data lake |
| Delta Lake | Table format | N/A — a storage layer | Transactional tables on a Spark/Databricks lake |

### Stream Tools

| Tool | Type | Typical Latency | Best For |
|---|---|---|---|
| Apache Kafka | Messaging platform | Milliseconds to seconds (transport only) | Moving events reliably between systems |
| Apache Flink | Processing engine | Milliseconds | True event-by-event, low-latency processing |
| Spark Structured Streaming | Processing engine | Seconds (micro-batch) | One unified engine for batch and stream |
| Apache Storm | Processing engine | Milliseconds | Legacy real-time systems |
| Apache Pulsar | Messaging platform | Milliseconds to seconds | Kafka alternative with multi-tenancy and geo-replication |

Cassandra sits outside both tables — it is neither a batch nor a stream processing engine, but the fast storage layer that both approaches often write their results into.

---

## 7. Combining Them in Practice (Extra Useful Knowledge)

In real projects, these tools are rarely used alone. They are usually combined into a full "Big Data ecosystem," with each piece handling the part it is best at:

- **Spark + HDFS**: Spark reads data stored in HDFS to process it faster than plain MapReduce, while still using existing Hadoop storage infrastructure.
- **Spark + Iceberg/Delta Lake on a data lake (e.g., S3)**: Spark handles the compute, while Iceberg or Delta Lake adds ACID transactions and time travel on top of the raw files — a common pattern known as the "lakehouse" architecture.
- **Kafka + Flink (or Spark Structured Streaming) + Cassandra**: Kafka moves events in, a stream processing engine transforms them in real time, and Cassandra stores the results for instant lookup by applications.
- **The wider Hadoop ecosystem** also includes **HBase** (a NoSQL database built on top of HDFS) and **Sqoop/Flume** (tools for importing data into Hadoop), alongside Hive mentioned earlier.
- **Current trend**: many organizations are moving from on-premise HDFS to **cloud storage** (Amazon S3, Google Cloud Storage, Azure Data Lake), pairing it with Spark or Flink as the processing engine and Iceberg or Delta Lake as the table format — separating storage from compute for more flexibility and lower cost.

**Quick summary**: if you need **instant read/write storage**, think of Cassandra. If you need **low-cost batch processing at massive scale**, think of Hadoop or Spark in batch mode. If you need **real-time, low-latency processing**, think of Kafka paired with Flink or Spark Structured Streaming. And if you need a **reliable, database-like data lake**, think of Iceberg or Delta Lake.