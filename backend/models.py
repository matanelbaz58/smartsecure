from sqlalchemy import Column, Integer, Float, Boolean
from database import Base

class Packet(Base):
    __tablename__ = "packets"

    id = Column(Integer, primary_key=True, index=True)
    duration = Column(Float)
    protocol_type = Column(Integer)  # e.g. 0=TCP, 1=UDP
    src_bytes = Column(Integer)
    dst_bytes = Column(Integer)
    is_attack = Column(Boolean, default=False)
