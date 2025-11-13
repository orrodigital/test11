#!/bin/bash

# Weather App Development Startup Script
echo "🌤️ Starting Fullscreen Weather App Development Servers"
echo "====================================================="

# Function to cleanup background processes
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "📝 Creating environment file from example..."
    cp server/.env.example server/.env
    echo "⚠️  Please edit server/.env with your OpenWeatherMap API key"
    echo "   1. Visit https://openweathermap.org/api"
    echo "   2. Create a free account"
    echo "   3. Generate an API key" 
    echo "   4. Replace 'your_openweathermap_api_key_here' with your actual key"
    echo ""
    read -p "Press Enter after updating your API key..."
fi

# Start backend server in background
echo "🌐 Starting backend server on port 3001..."
cd server && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Return to root directory
cd ..

# Start frontend server in background  
echo "🖥️ Starting frontend server on port 3000..."
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started successfully!"
echo "   🖥️  Frontend: http://localhost:3000"
echo "   🌐 Backend:  http://localhost:3001"
echo "   📚 API Docs: http://localhost:3001/api/weather"
echo ""
echo "📱 Usage Tips:"
echo "   • Desktop: Click anywhere on map to get weather"
echo "   • Mobile: Swipe left/right to change layers"
echo "   • Mobile: Rotate to landscape for presenter mode"
echo "   • Click ZIP button (top-right) for location search"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait