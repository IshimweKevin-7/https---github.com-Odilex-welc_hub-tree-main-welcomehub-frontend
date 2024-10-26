'use client'

import { useState, useEffect } from "react"
import { Bell, Home, MapPin, Settings, Sun, Wallet2, Calendar, Bus, Coffee, Beer, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Define types for weather and location
interface Weather {
  temp: number;
  condition: string;
}

interface Location {
  lat: number;
  lon: number;
}

export default function Component() {
  const [activeSection, setActiveSection] = useState<string>("Dashboard")
  const [weather, setWeather] = useState<Weather>({ temp: 22, condition: "Partly cloudy" })
  const [location, setLocation] = useState<Location | null>(null)
  const [walletBalance, setWalletBalance] = useState<number>(1000)
  const { toast } = useToast()

  useEffect(() => {
    // Simulating geolocation fetch
    const fetchLocation = async () => {
      // In a real app, you'd fetch the user's location here
      setLocation({ lat: -1.9441, lon: 30.0619 }) // Coordinates for Kigali, Rwanda
    }
    fetchLocation();

    // Fetch weather data from an API
    const fetchWeather = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location?.lat},${location?.lon}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWeather({ temp: data.current.temp_c, condition: data.current.condition.text });
      } catch (error) {
        toast({ title: "Error fetching weather data", description: error.message, variant: "destructive" });
      }
    }

    // Call fetchWeather only if location is available
    if (location) {
      fetchWeather();
    }
  }, [location]) // Dependency on location

  const sidebarItems = [
    { name: "Dashboard", icon: Home },
    { name: "Wallet", icon: Wallet2 },
    { name: "Accommodations", icon: MapPin },
    { name: "Events", icon: Calendar },
    { name: "Transport", icon: Bus },
    { name: "Weather", icon: Sun },
  ]

  const getDrinkRecommendation = () => {
    if (weather.condition === "Sunny") {
      return "On this sunny day, we recommend visiting Inzora Rooftop Cafe for refreshing drinks with a view!"
    } else {
      return "It's a bit rainy today. How about warming up with a coffee at Question Coffee Cafe?"
    }
  }

  const getWalletAdvice = () => {
    if (walletBalance < 500) {
      return "Your balance is running low. Consider topping up or finding budget-friendly options."
    } else if (walletBalance < 2000) {
      return "You have a moderate balance. Enjoy your activities while keeping an eye on your spending."
    } else {
      return "Your balance is healthy! Feel free to splurge on premium experiences."
    }
  }

  const sectionData = {
    Dashboard: {
      title: "Welcome, Michael!",
      subtitle: "What would you like to explore in Rwanda today?",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{walletBalance} RWF</p>
              <p className="text-sm text-gray-600">Available balance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">Kigali Jazz Festival</p>
              <p className="text-sm text-gray-600">2023-07-15</p>
              <p className="text-sm text-gray-600">Kigali Convention Center</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Weather</CardTitle>
            </CardHeader>
            < CardContent>
              <p className="text-3xl font-bold">{weather.temp}°C</p>
              <p className="text-sm text-gray-600">{weather.condition}</p>
            </CardContent>
          </Card>
        </div>
      ),
    },
    Wallet: {
      title: "Wallet",
      subtitle: "Manage your finances",
      content: (
        <div>
          <p>Wallet balance: {walletBalance} RWF</p>
          <p>{getWalletAdvice()}</p>
          <Button variant="primary">Top up wallet</Button>
        </div>
      ),
    },
    Accommodations: {
      title: "Accommodations",
      subtitle: "Find a place to stay",
      content: (
        <div>
          <p>Recommended accommodations:</p>
          <ul>
            <li>Hotel des Mille Collines</li>
            <li>Radisson Blu Hotel & Convention Centre</li>
          </ul>
        </div>
      ),
    },
    Events: {
      title: "Events",
      subtitle: "Discover what's happening",
      content: (
        <div>
          <p>Upcoming events:</p>
          <ul>
            <li>Kigali Jazz Festival</li>
            <li>Rwanda International Film Festival</li>
          </ul>
        </div>
      ),
    },
    Transport: {
      title: "Transport",
      subtitle: "Get around Kigali",
      content: (
        <div>
          <p>Recommended transport options:</p>
          <ul>
            <li>Moto-taxis</li>
            <li>Public buses</li>
          </ul>
        </div>
      ),
    },
    Weather: {
      title: "Weather",
      subtitle: "Stay informed",
      content: (
        <div>
          <p>Current weather: {weather.temp}°C, {weather.condition}</p>
          <p>{getDrinkRecommendation()}</p>
        </div>
      ),
    },
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-lg font-bold">Menu</h2>
        <ul>
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Button variant="link" onClick={() => setActiveSection(item.name)}>
                <item.icon size={20} />
                <span className="ml-2">{item.name}</span>
              </Button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold">{sectionData[activeSection].title}</h1>
        <p className="text-sm text-gray-600">{sectionData[activeSection].subtitle}</p>
        {sectionData[activeSection].content}
      </main>
    </div>
  )
}