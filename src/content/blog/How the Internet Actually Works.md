---
title: "Demystifying Network Protocols: How the Internet Actually Works"
date: 2026-08-13
categories: [technology, networking, architecture]
---

# The Invisible Rules That Keep You Online

Have you ever wondered what happens behind the scenes when you open a website or stream a video? You don't see it, and you rarely have to think about it, but without a set of invisible rules, the internet would simply stop working.

In the digital world, networking is like a global postal and traffic system. **Protocols** are the rules and standards that allow different devices to connect, communicate, and understand each other.

Let's dive into the 12 most essential network protocols that power our modern internet.

---

## 1. TCP/IP: The Foundation of the Internet

When you request a web page, **TCP (Transmission Control Protocol)** and **IP (Internet Protocol)** work together as the ultimate delivery team.

### IP (Direction & Addressing)
Think of IP as the home address and navigation map. It ensures data knows where to go.

* **IPv4 vs. IPv6:** IPv4 looks like `192.168.1.1`, but we ran out of these! IPv6 was created to give us practically infinite addresses.
* **Public vs. Private IP:** Public IPs face the internet, while Private IPs are used internally within your home or office network.

### TCP (Reliability)
TCP is like a highly responsible postman who guarantees your package arrives safely.
How does TCP ensure zero data loss?

1. **The 3-Way Handshake:** Before sending any data, TCP sets up a connection via a strict 3-step process:
   * **SYN (Synchronize):** The Client says "Hello, can we talk?"
   * **SYN-ACK:** The Server replies "Hi, yes I am ready!"
   * **ACK (Acknowledge):** The Client confirms "Great, I'm sending data now."

   ![TCP 3-Way Handshake](../public/images/s003/TCP-3-Way-Handshake.png)

2. **Breaking Data & Numbering System:** You can't send a massive 4K video all at once. TCP breaks the data into small parts (packets) and **numbers each part**.
   * *Why?* If packet #5 gets lost on the way, the receiving device will notice it's missing and request a **retransmission** of only packet #5, instead of downloading the whole video again. Once all packets arrive, they are reassembled in the correct numbered order.

3. **Flow Control & Congestion Control:** Beyond retransmission, TCP also protects the connection in two other ways: flow control keeps the sender from overwhelming a slow receiver, and congestion control keeps it from overwhelming the network itself. Together, these mechanisms are just as central to TCP's reliability as retransmission is.

4. **Ports: How One IP Address Handles Many Conversations at Once:** An IP address gets you to the right *device*, but a device usually has dozens of things happening at once, a browser tab, an email client, a game. **Ports** (numbers from 0–65535) identify *which application* on that device the data is meant for. The combination of `IP address + Port` is called a **socket**, and it's what actually uniquely identifies a single conversation. Some ports are reserved by convention for well-known services (e.g. 80 for HTTP, 443 for HTTPS, 22 for SSH) — you'll see these numbers reappear throughout this article.

5. **Ending the Conversation. The 4-Way Handshake:** Just as TCP is careful about starting a connection, it's careful about closing one too:
   * The side that's done sends a **FIN** ("I'm finished sending").
   * The other side replies with an **ACK**, then — once it's also done — sends its own **FIN**.
   * The first side sends a final **ACK**, and the connection is fully closed.

   This is why closing a TCP connection is often called a "4-way handshake", it makes sure neither side loses data that was still in transit when the other side wanted to stop.
   ![TCP 4-Way Handshake](../public/images/s003/TCP-4-way-handshake.webp)

---

## 2. UDP: The Need for Speed

**UDP (User Datagram Protocol)** is the opposite of TCP. It acts like a high-speed flyer distributor.

![UDP Working](../blog/public/images/s003/udp-working.png)

* **No Setup, No Handshake:** It does not check if the other side is ready. It sends data immediately.
* **No Confirmation:** There is no numbering system, no acknowledgements, and no retransmissions.
* **The Benefit:** Because it skips all these checks, UDP is incredibly fast and lightweight. It has **no overhead latency**.
* **Use Cases:** It is perfect for fast-paced scenarios where speed matters more than perfection, such as Online Gaming, VoIP (Video calls), and Live Streaming. A tiny glitch in a game is better than a 2-second freeze waiting for old data to arrive.
* **Why It's So Light — The Header:** You can see the speed difference in the numbers themselves. A UDP header is only **8 bytes** — just enough for a source port, destination port, length, and an optional checksum. A TCP header, by comparison, is at least **20 bytes** and carries all the extra bookkeeping (sequence numbers, acknowledgment numbers, flow-control window size) needed for its reliability guarantees. That difference is the literal cost of "no overhead."


---

## 3. DNS: The Internet's Phonebook

Computers talk to each other using long strings of numbers (IP addresses). But humans can't remember all those numbers. **DNS (Domain Name System)** translates easy-to-remember domain names (like `google.com`) into computer-friendly IP addresses (like `142.250.190.46`).

![DNS Process](../public/images/s003/DNS-Process.png)

### How a Lookup Actually Travels
A single DNS lookup usually isn't just "ask one server, get an answer." It's a small relay race through a hierarchy:

1. **Recursive Resolver:** Your device first asks a resolver (often run by your ISP, or a public one like `8.8.8.8`) — this is the one that does all the legwork on your behalf.
2. **Root Server:** If the resolver doesn't already know the answer, it asks one of the internet's root servers, which basically says "I don't know the IP, but I know who handles `.com` addresses — ask them."
3. **TLD Server:** The resolver then asks the Top-Level-Domain server (the one responsible for `.com`, `.org`, `.net`, etc.), which points to the specific server responsible for that domain.
4. **Authoritative Server:** Finally, the resolver asks the domain's own authoritative server, which gives the actual, final IP address.

The resolver then hands that IP back to your device — and **caches** it for a while so the whole trip doesn't have to happen again on your next visit. How long it caches the answer is controlled by the record's **TTL (Time To Live)**.

### Common DNS Record Types
DNS doesn't only store IP addresses. A few record types you'll commonly run into:

* **A record:** Maps a domain to an IPv4 address.
* **AAAA record:** Maps a domain to an IPv6 address.
* **CNAME record:** Points one domain name to another domain name (an alias).
* **MX record:** Points to the mail servers responsible for handling email for that domain.
* **TXT record:** Holds arbitrary text, often used for verification or security policies (like SPF/DKIM for email).

---

## 4. DHCP: The IP Distributor

*Note: A common misconception is that DHCP doesn't hand out IP addresses. In reality, that is its exact job!*
**DHCP (Dynamic Host Configuration Protocol)** automatically hands out IP addresses to devices on a network. When you connect your phone to Wi-Fi, DHCP automatically gives you an IP address, a Default Gateway, and a DNS server so you can access the internet instantly without manual configuration.

### The Handshake Behind It: DORA
Getting that address happens through a short 4-step exchange, often remembered by the acronym **DORA**:

1. **Discover:** Your device broadcasts "Is there a DHCP server out there? I need an address!"
2. **Offer:** A DHCP server responds, offering an available IP address.
3. **Request:** Your device replies, formally requesting that specific offered address.
4. **Acknowledge:** The server confirms — the address is now officially yours (for a while).

![DHCP Handshake](../public/images/s003/DHCP.png)

That last part matters: DHCP addresses are usually **leased**, not permanent. After a set period, your device has to renew the lease, which is why your home IP can occasionally change if a device has been offline for a long time.

---

## 5. HTTP & HTTPS: The Language of the Web

* **HTTP (Hypertext Transfer Protocol):** The fundamental language web browsers and servers use to request and send website data (like HTML and images).
* **HTTPS:** The "S" stands for **Secure**. It means the communication between your browser and the website is encrypted, protecting your data from hackers.

### How HTTP Actually Works
HTTP runs on a simple **request-response** model on top of TCP (traditionally port 80):

* **The Request:** Your browser sends a method (like `GET` to retrieve a page, `POST` to submit data, `PUT`/`DELETE` to update or remove a resource), a path (`/products/123`), and a set of headers (metadata like what language you prefer, what browser you're using, any cookies you're carrying).
* **The Response:** The server replies with a **status code** that tells your browser what happened, plus headers and the actual content (HTML, JSON, an image, etc.).

Status codes are grouped by their first digit, and it's worth knowing the families:
* **1xx** – Informational (rare to see directly)
* **2xx** – Success (`200 OK` is the classic one)
* **3xx** – Redirection (`301 Moved Permanently`)
* **4xx** – Client error (`404 Not Found` is the famous one)
* **5xx** – Server error (`500 Internal Server Error`)

One quirk worth knowing: HTTP is **stateless** — by default, the server has no memory of you between requests. That's why sites use **cookies** (small pieces of data your browser stores and re-sends with every request) to "remember" you're logged in, what's in your cart, and so on.

### Why HTTPS Had to Exist
Plain HTTP sends everything — including passwords and credit card numbers — as **plaintext**. Anyone sitting on the same network (a coffee shop Wi-Fi, an ISP, an attacker doing a "man-in-the-middle" attack) can read or even tamper with that traffic. HTTPS was created to solve three specific problems at once:

* **Encryption:** No one in between can read what you're sending.
* **Integrity:** No one in between can silently modify the data without it being detected.
* **Authentication:** You can actually verify you're talking to the real `yourbank.com`, not an impostor pretending to be it.

HTTPS achieves this by wrapping ordinary HTTP inside a **TLS** encryption layer (see Section 9) before it ever hits the network — which is also why HTTPS traditionally runs on a different port, **443**, instead of HTTP's 80.

### A Quick Word on Versions
* **HTTP/1.1** opened one connection per request-response pair (later improved to reuse connections, but still one at a time).
* **HTTP/2** introduced **multiplexing** — multiple requests and responses can travel over a single connection at the same time, which is a big speed win.
* **HTTP/3** goes a step further by running over **QUIC** instead of TCP (see Section 11), avoiding TCP's head-of-line blocking entirely.

---

## 6. FTP, FTPS, and SFTP: Moving Files

**FTP (File Transfer Protocol)** is one of the oldest ways to move files across a network. It uniquely uses two separate connections:

* **Control Connection (Port 21):** Used for logging in and telling the server what to do.
* **Data Connection (Port 20 in Active mode):** The actual pipeline where the file data flows.

* **Active vs. Passive Mode:** In Active mode, the server connects back to the client on port 20 to send data (often blocked by firewalls). In Passive mode, the server instead opens a random high-numbered port and tells the client which one to connect to over the control connection — this makes Passive mode much more firewall-friendly.
* **FTPS:** Traditional FTP but wrapped in **SSL/TLS** encryption.
* **SFTP:** Despite the name, this doesn't use FTP at all! It stands for SSH File Transfer Protocol. It is highly secure, runs over **SSH**, and only requires a single port.

### Why the "S" Versions Exist
Just like HTTP, plain FTP sends usernames, passwords, and file contents in cleartext — including the login credentials themselves, which makes it one of the riskier legacy protocols to leave exposed. FTPS and SFTP exist for exactly the same underlying reason HTTPS exists: to add encryption around a protocol that was originally designed with zero security in mind.

---

## 7. SSH: The Secure Remote Control

**SSH (Secure Shell)** allows administrators to securely log into and control remote servers via a command line. Instead of relying solely on passwords, SSH uses a highly secure **Key Pair** system:

* **Public Key:** The padlock, kept on the server.
* **Private Key:** The unique key, kept securely on your personal computer.

The server will only grant access if your computer holds the exact Private Key that fits its Public Key.

### How the Connection Actually Gets Secured
SSH typically runs on **port 22**, and securing a session happens in two stages:

1. **Key Exchange (asymmetric):** The client and server use their key pair to agree on a shared secret, and — for key-based logins — the server confirms the client owns the matching private key, without that private key ever leaving the client's machine.
2. **Session Encryption (symmetric):** Once that secret is established, SSH switches to fast symmetric encryption for the rest of the session. Asymmetric cryptography is powerful but computationally expensive, so it's only used briefly to safely set up a session key — the same "hand off to something faster" trick TLS uses (see Section 9).

---

## 8. SMTP, POP3, and IMAP: The Email Trio

These three protocols run the world's email systems:

* **SMTP:** Used to **push** (send) emails from your device to the server, and between servers.
* **POP3:** Used to **pull** (receive) emails. It downloads the email to your device and usually deletes the original copy from the server.
* **IMAP:** Also used to **pull** emails, but it keeps the emails on the server and syncs their status (read/unread) across all your devices (phone, laptop, tablet).

### The Journey of an Email
Email travels through a small relay chain of its own:

1. Your mail app (the **MUA**, Mail User Agent) hands your message to an outgoing server using **SMTP**.
2. That server (an **MTA**, Mail Transfer Agent) uses SMTP again to relay the message — possibly hopping through several other MTAs — until it reaches the recipient's mail server.
3. The message sits in the recipient's mailbox until their mail app pulls it down using either **POP3** or **IMAP**.

### Default Ports Worth Knowing
* **SMTP:** port 25 (server-to-server relay) or 587 (submission from your device, usually with encryption)
* **POP3:** port 110, or 995 when encrypted
* **IMAP:** port 143, or 993 when encrypted

---

## 9. TLS/SSL: The Encryption Armor

These are cryptographic protocols. **SSL** is an older version that is now obsolete. **TLS** is the modern, highly secure standard. They provide the encryption layer used in HTTPS, FTPS, and secure emails, ensuring that sensitive data (like passwords and credit cards) turns into unreadable gibberish if intercepted.

### How a TLS Handshake Actually Secures a Connection
This is the machinery hiding behind that little padlock icon in your browser:

1. **Certificate Check:** The server presents a **digital certificate**, issued by a trusted **Certificate Authority (CA)**. Your browser checks this certificate to confirm the server is really who it claims to be — this is the "authentication" piece.
2. **Key Exchange:** The client and server use asymmetric cryptography just long enough to safely agree on a shared **session key**, without ever sending that key in the clear.
3. **Symmetric Encryption Takes Over:** From that point on, all the actual data (your HTTP requests, your file transfer, your email) is encrypted using fast symmetric encryption with that session key.

Modern **TLS 1.3** streamlined this into fewer round trips than older TLS/SSL versions, and added **forward secrecy** by default — meaning each session generates a fresh key, so even if one session's key were somehow exposed later, past and future sessions stay safe.

---

## 10. WebSocket: Real-Time Communication

While HTTP requires the browser to ask for updates, **WebSocket** creates a continuous, bi-directional (two-way) connection between the client and server. It is the heart of real-time applications like Live Chat apps, multiplayer browser games, and live cryptocurrency price tickers.

### How It Gets Started
A WebSocket connection doesn't appear out of nowhere — it's born from an ordinary HTTP request. The client sends a normal HTTP request containing an `Upgrade: websocket` header, essentially asking "can we switch protocols?" If the server agrees, it responds with `101 Switching Protocols`, and from that moment on, the same underlying TCP connection is repurposed to carry WebSocket frames instead of HTTP messages — staying open for as long as both sides want, instead of closing after a single request-response like ordinary HTTP.

---

## 11. QUIC: The Next Generation

Created by Google (and now the foundation of HTTP/3), **QUIC** aims to achieve the impossible: providing the reliability of TCP but at the speed of UDP.

QUIC is actually built on top of **UDP**. It rebuilds the error-checking mechanisms internally, and merges the transport and TLS handshakes into a single step. For a brand-new connection this brings the setup down to just 1 round trip (1-RTT), and for a server you've already connected to before, QUIC can resume with 0-RTT, sending data immediately, with no round trip at all. Rather than eliminating handshake delay entirely, QUIC dramatically shrinks it, which is what makes websites feel faster to load, even on poor network connections.

### Solving TCP's Hidden Traffic Jam
QUIC also fixes a subtle problem in HTTP/2-over-TCP called **head-of-line blocking**: because TCP delivers bytes in strict order, if a single packet belonging to *one* file on a page gets lost, *every other file* sharing that connection has to wait for it to be resent before any of them can continue. QUIC organizes data into independent **streams**, so a lost packet on one stream (say, one image) no longer stalls the others (like your page's HTML or CSS).

---

## 12. BGP: The Internet's Google Maps

**BGP (Border Gateway Protocol)** is the routing protocol that makes the massive, decentralized internet function. The internet is a web of thousands of smaller networks (Autonomous Systems / ISPs). When you send data from Asia to a server in America, BGP communicates between global routers to pick a path, but it's worth being precise about what "best path" means here. BGP does not monitor real-time traffic congestion; it doesn't know which links are currently jammed. Instead, it chooses routes based on policy and path attributes, such as the number of AS hops, Local Preference, and MED (Multi-Exit Discriminator), factors that often reflect business agreements between ISPs as much as raw distance. So two networks might route traffic through a technically longer path simply because of a peering contract, not because the shorter path is congested. BGP finds the most policy-optimal path, not necessarily the least busy one.

### A Word on Autonomous Systems
Each of those "smaller networks" — a large ISP, a university network, a big cloud provider is officially identified by a unique number called an **AS (Autonomous System) number**. When BGP runs *between* two different AS's, it's called **eBGP** (external BGP); when it's used to distribute routing information *inside* a single AS's own routers, it's called **iBGP** (internal BGP). That distinction is why BGP is sometimes described as working at two different scales at once — gluing the internet together globally, while also helping route traffic sanely within one organization's own network.

---

## Bonus: Concepts That Tie It All Together

The 12 protocols above each solve one piece of the puzzle. A few extra concepts explain how those pieces fit into a single working system.

### Ports — One Address, Many Conversations
As mentioned in Section 1, an IP address gets data to the right *device*, and a **port number** gets it to the right *application* on that device. This is why a single server can run a website (port 443), an email service (port 587), and an SSH login (port 22) simultaneously on the exact same IP address, the port number is what keeps all those conversations separate.

### NAT — Sharing One Public IP Among Many Devices
Your home probably has just **one** public IP address from your ISP, yet your phone, laptop, and smart TV are all online at once. **NAT (Network Address Translation)**, running on your router, is what makes this possible: it rewrites the private IP addresses of your devices into that single public IP (and back again for replies), keeping track of which internal device each response belongs to using, you guessed it, port numbers. NAT is also a major reason IPv4 addresses haven't run out even faster than they have.

### Where Everything Fits: The Layered Model
Networking is commonly described in **layers**, where each layer only worries about its own job and hands off to the layer below/above it. A simplified view, matching the protocols above:

| Layer | Job | Protocols From This Article |
|---|---|---|
| Application | The actual content/meaning of the communication | HTTP/HTTPS, FTP/SFTP, SSH, SMTP/POP3/IMAP, DNS, WebSocket |
| Transport | Getting data between the right *applications*, reliably or fast | TCP, UDP, QUIC |
| Network | Getting data between the right *devices*, across networks | IP, BGP |
| (Security, cutting across layers) | Encrypting/authenticating whatever sits above it | TLS/SSL |

This is a simplified version of the classic **OSI 7-layer model** (which further splits things into Physical, Data Link, Network, Transport, Session, Presentation, and Application layers) — but the version above is usually enough to reason about how the protocols in this article relate to each other.

### A Day in the Life of a Web Request
To see all of this working together, here's what actually happens, roughly in order, when you type `https://example.com` into your browser and hit enter:

1. **DHCP** (already done, back when you joined the network) gave your device an IP address, gateway, and DNS server.
2. **DNS** resolves `example.com` into an IP address, walking the resolver → root → TLD → authoritative chain if it isn't already cached.
3. **TCP** performs its 3-way handshake with that IP address (traditionally on port 443 for HTTPS).
4. **TLS** performs its handshake on top of that TCP connection — checking the server's certificate and agreeing on an encryption key.
5. **HTTP** (now riding safely inside that encrypted tunnel, which is exactly what makes it **HTTPS**) sends the actual `GET /` request and receives the page back.
6. If the page includes a live chat widget, a separate **WebSocket** connection may be opened to keep it updated in real time.
7. Behind the scenes, **BGP** was quietly responsible for making sure your packets found a viable path across however many networks separated you from that server in the first place.

One page load, seven protocols, and none of it visible to you — which is exactly the point of good infrastructure.

 
### Try It Yourself: example.com, Command by Command
 
Reading about these commands is one thing; running them is what actually makes the mental model stick. `example.com` is the ideal domain to practice on — it's reserved by IANA specifically for documentation and testing, so it always resolves, never goes down, and won't mind being hit with test commands over and over. (The sample output below uses IP addresses from documentation-reserved ranges to show the *shape* of a real answer — your own terminal will show real values when you run these yourself.)
 
**`dig example.com`**
```
;; ANSWER SECTION:
example.com.        300    IN    A    203.0.113.10
 
;; Query time: 24 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
```
Two numbers matter most here: `300` is the TTL — how many seconds this answer can be cached before a resolver has to ask again — and `Query time` is how long your own resolver took to hand it back. A single, clean `A` record like this is the sign of a simple DNS setup, unlike a multi-IP answer such as the `dataxight.com` lookup earlier.
 
**`dig example.com +trace`**
```
com.            172800  IN  NS  a.gtld-servers.net.
example.com.    172800  IN  NS  a.iana-servers.net.
example.com.    300     IN  A   203.0.113.10
```
Here the handoff is spelled out explicitly: the root servers point you to whoever runs `.com`, the `.com` servers point you to `example.com`'s own name servers, and only then does the final authoritative server hand back the IP. If this command times out on your network — the way it did earlier — that's almost always your network's handling of manual recursive queries, not the domain itself.
 
**`ping example.com`**
```
64 bytes from 203.0.113.10: icmp_seq=0 ttl=56 time=18.2 ms
```
`time=18.2 ms` is round-trip latency; `ttl=56` is how many router hops the packet had left when it arrived — a rough proxy for distance traveled. `example.com` happens to answer pings, but plenty of production sites behind AWS, Cloudflare, or similar infrastructure deliberately don't — which is exactly why a `ping` timeout on its own never proves a site is down.
 
**`curl -I https://example.com`**
```
HTTP/1.1 200 OK
content-type: text/html; charset=UTF-8
content-length: 1256
```
The `-I` flag sends a `HEAD` request instead of a `GET` — same round trip, minus the actual page body — so you get the status code and headers back in a fraction of a second. `200 OK` alone is often the entire health check you need.
 
**`curl -v https://example.com`**
```
* Connected to example.com (203.0.113.10) port 443
* ALPN: curl offers h2,http/1.1
* TLS handshake, Server hello (2)
* SSL connection using TLSv1.3
* ALPN: server accepted http/1.1
* Server certificate: CN=example.com; issuer=DigiCert
> GET / HTTP/1.1
< HTTP/1.1 200 OK
```
This is the one command that walks every layer in order inside a single call: the TCP connect, the ALPN negotiation (deciding HTTP/1.1 vs. HTTP/2), the TLS handshake and the certificate it presents, and finally the HTTP request/response itself. When something's broken, this output tells you exactly which of those four stages it broke at — which is what makes `-v` more useful than any single-purpose tool on this list.
 
**`openssl s_client -connect example.com:443 -servername example.com`**
 
The `-servername` flag matters more than it looks. It sets **SNI (Server Name Indication)** — telling the server which domain you're asking for *before* the TLS handshake even completes. That matters because a single IP address commonly hosts many different HTTPS domains, each with its own certificate; without SNI, the server has no way to know which one to present. Piping the output through `openssl x509 -noout -dates` shows the exact certificate validity window — the same field that flagged the near-expiry issue on `dataxight.com` earlier.
 
**`traceroute example.com`** (or `mtr example.com`)
```
1  192.168.1.1        1.2 ms
2  10.10.0.1           8.4 ms
3  *  *  *
4  203.0.113.10       19.1 ms
```
Hop 3 timing out (`* * *`) doesn't mean the path is broken — it usually just means that particular router is configured to drop or deprioritize the probe traffic `traceroute` sends, while still forwarding your actual HTTP traffic normally. What matters is whether the *final* hop responds, which it does here.
 
### Your Diagnostic Toolkit, One Line Each
 
Before combining these commands into a diagnosis, it helps to know exactly what each one checks. Every command below answers one narrow question — nothing more — and that narrowness is precisely what makes it useful:
 
* `dig domain.com` — resolves the domain to an IP address and shows how long that answer stays cached (its TTL).
* `dig domain.com +trace` — walks the resolution manually through the root, TLD, and authoritative servers, instead of letting a single resolver hand you the final answer.
* `ping domain.com` — sends ICMP echo requests to check basic reachability and round-trip latency at the network layer.
* `traceroute domain.com` (`tracert` on Windows) or `mtr domain.com` — maps the hop-by-hop path your packets take across the networks between you and the destination.
* `curl -I https://domain.com` — fetches only the response headers; the fastest possible health check.
* `curl -v https://domain.com` — the most complete single command available: it shows the IP it connected to, the TCP handshake, the TLS negotiation and certificate, and the full request/response headers, all in one pass.
* `openssl s_client -connect domain.com:443 -servername domain.com` — inspects the TLS handshake and certificate chain directly, for when `curl`'s summary isn't detailed enough.
* `whois domain.com` — looks up who registered the domain and when *that* registration expires, a different kind of expiry than the TLS certificate's, and one that's easy to confuse with it.
With the toolkit itself out of the way, the real skill isn't running these commands. It's knowing what a result from each one does, and doesn't, actually tell you — which is where things get interesting.
 
### From Checks to Answers: "What Do I Have?" vs "What Do I Not Have?"
 
Running the commands from the overview above is the easy part. The harder part is turning a wall of terminal output into two simple answers:
 
* **What do I have?** — which layers are confirmed present and working.
* **What do I not have?** — which layers are actually missing, broken, or misconfigured.
The trap most people fall into is treating every failed command as proof something is broken. Some checks are designed to fail silently for reasons that have nothing to do with the site being down — mistaking "blocked" for "broken" is the single most common misread in basic network troubleshooting.
 
| Command | A success confirms you HAVE... | A failure could mean you're missing something or could just mean... |
|---|---|---|
| `dig domain.com` | A working DNS record, resolvable from at least one path | The record really is broken or your configured resolver is unreachable |
| `dig +trace` | The full delegation chain (root → TLD → authoritative) is walkable from your machine | Often just your local network/firewall blocking manual recursive lookups, rarely the site's fault |
| `ping domain.com` | Basic reachability at the network layer | The server may simply drop ICMP by design (very common behind AWS, Cloudflare, and other CDNs) — not proof the site is down |
| `curl -I` / `curl -v` | TCP connects, TLS negotiates, and HTTP responds with real headers | A genuine problem, this command touches every layer, so a failure here is worth investigating |
| `openssl s_client` | The exact certificate details and expiry date | A real TLS/certificate issue, if `curl -v` already pointed you here |
| `traceroute` / `mtr` | The path completes to the destination | Individual hops often drop ICMP without dropping real traffic, a timeout mid-route isn't automatically a problem |
 
**A practical order to work through them:**
 
1. **Start with `curl -v`.** It's the one command that touches DNS, TCP, TLS, and HTTP in a single pass, and its output tells you exactly which stage failed, that's usually enough to answer "what do I not have" on its own.
2. **If DNS looks suspect**, follow up with `dig` to confirm the record itself, separate from your resolver.
3. **If TLS looks suspect**, follow up with `openssl s_client` to inspect the certificate independent of `curl`.
4. **Only treat `ping` or `traceroute` failures as meaningful if `curl -v` also failed.** If HTTP came back fine, a `ping` timeout almost always just means 
 