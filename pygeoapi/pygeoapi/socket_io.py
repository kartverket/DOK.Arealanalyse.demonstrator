import os
import socketio

try:
    url = os.environ.get('SOCKET_IO_URL', 'http://0.0.0.0:5002')
    sio = socketio.SimpleClient()
    sio.connect(url, socketio_path='/ws/socket.io')
except:
    sio = None
