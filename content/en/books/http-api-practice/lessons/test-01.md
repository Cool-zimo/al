# Chapter 1 Quiz · The Origin of HTTP

> 8 questions, covering lessons 01-05. Answer all correctly to master this chapter.
> Try it yourself first, then go back to the relevant lesson for anything you got wrong — history is easy to skim and forget, but these concepts come back again and again.

```quiz
type: choice
q: In the first computer network transmission on October 29, 1969, how many letters actually got through?
options:
- Five (LOGIN succeeded completely)
- Two (LO, then the system crashed)
- Zero (they never connected)
- One (only L)
answer: 1
explain: Charley Kline meant to type LOGIN; the system crashed on the third letter, G, so only LO arrived
```

```quiz
type: choice
q: Compared with circuit switching, what is the key difference of packet switching?
options:
- Packet switching is faster
- Packet switching sets up no dedicated line; each packet routes independently and detours around failed nodes
- Packet switching can only carry text
- Packet switching needs a central switch to coordinate
answer: 1
explain: The core is "no dedicated line, no central node" — which was the entire point: keep communicating even under attack
```

```quiz
type: choice
q: What did CERN decide on April 30, 1993 that is considered key to the Web beating the commercial networks of its era?
options:
- It patented the technology and charged licensing fees
- It placed the technology in the public domain, free for anyone
- It opened it free, but only to European research institutions
- It sold the technology to US companies
answer: 1
explain: Giving it away meant anyone could freely write browsers, run servers and build sites. Against walled gardens like AOL and Minitel, this is why the Web exploded
```

```quiz
type: choice
q: ENQUIRE (1980) and the World Wide Web differ in one key way about links. What is it?
options:
- ENQUIRE's links were bidirectional (the association was visible from both ends); the Web's are one-way
- ENQUIRE's links could only point at text
- ENQUIRE's links required payment
- ENQUIRE's links expired automatically
answer: 0
explain: Bidirectional links need both ends managed in one system; the Web is distributed, and you can't force someone else's server to maintain a reverse link. That's the price of distribution, and Berners-Lee later said he regretted losing it
```

```quiz
type: choice
q: Why did HTTP/1.1 make the Host header mandatory?
options:
- To identify the client's operating system
- To let one server (one IP) host many sites under different domains
- To encrypt the request contents
- To tell the server which compression formats the client supports
answer: 1
explain: Once virtual hosting spread, dozens of sites ran on one IP and the server needed Host to tell which you wanted. The spec says an HTTP/1.1 request missing Host should get 400
```

```quiz
type: choice
q: HTTP/2 fixed application-layer head-of-line blocking with multiplexing, so why is it sometimes slower than HTTP/1.1 on lossy networks?
options:
- Header compression breaks when packets are lost
- All streams share one TCP connection, and TCP's in-order delivery means one lost packet makes every stream wait for the retransmission
- HTTP/2 doesn't support concurrency
- HTTP/2's mandatory encryption slows it down
answer: 1
explain: HTTP/1.1 has 6-8 connections, so one stall still leaves others running; HTTP/2 packs every stream into a single TCP connection, where one loss stalls them all. That's the fundamental reason HTTP/3 had to replace TCP
```

```quiz
type: function
q: HTTP/2 sends data cut into frames. Write frames_needed(total, size) returning how many frames are needed for total bytes at size bytes per frame (a final partially-filled frame still counts). Return 0 when total is 0.
func: frames_needed
starter: |
  def frames_needed(total, size):
      # Hint: ceiling division; handle 0 separately
      return 0
cases: |
  100, 10 -> 10
  105, 10 -> 11
  0, 10 -> 0
  16384, 16384 -> 1
hint: (total + size - 1) // size is ceiling division, but check whether total is 0 first
explain: Same maths as the packet-switching exercise in lesson 01. Protocol layering is full of "cut into fixed-size pieces": TCP segments, IP packets, HTTP/2 frames
```

```quiz
type: function
q: Browsers use a default port when you don't write one. Write default_port(scheme): http → 80, https → 443, ftp → 21, anything else → None. The scheme may be uppercase, so lowercase it first.
func: default_port
starter: |
  def default_port(scheme):
      # Hint: lower() first, then dict get
      return None
cases: |
  "http" -> 80
  "https" -> 443
  "HTTP" -> 80
  "ftp" -> 21
  "mysql" -> None
hint: Use {"http":80,"https":443,"ftp":21}.get(scheme.lower()) — dict get returns None when the key is absent
explain: This is exactly what browsers do: no port written, fill in the default by scheme. Port 80 was assigned by IANA with no special meaning — it just got picked, and then could never be changed again
```
