from pydantic import BaseModel

class PacketCreate(BaseModel):
    duration: float
    protocol_type: int
    src_bytes: int
    dst_bytes: int

class PacketOut(PacketCreate):
    id: int
    is_attack: bool

    class Config:
        from_attributes = True
