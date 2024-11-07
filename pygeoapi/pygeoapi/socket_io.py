import socketio

try:
    sio = socketio.SimpleClient()
    sio.connect('http://0.0.0.0:5002')
except:
    sio = None    
