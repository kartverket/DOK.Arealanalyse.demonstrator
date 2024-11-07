import socketio

sio = socketio.AsyncServer(cors_allowed_origins=[], async_mode='asgi')
sio_app = socketio.ASGIApp(sio, socketio_path='/ws/socket.io')


@sio.on('connect')
async def connect(sid, *args):
    print(f'Client connected: {str(sid)}')


@sio.on('disconnect')
async def disconnect(sid):
    print(f'Client disconnected: {str(sid)}')
