import pyshark
capture = pyshark.LiveCapture(interface="eth0")
for packet in capture.sniff_continuously(packet_count=10):
    print(packet)
