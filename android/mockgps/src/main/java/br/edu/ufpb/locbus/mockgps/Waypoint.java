package br.edu.ufpb.locbus.mockgps;

public class Waypoint {
    public final double latitude;
    public final double longitude;
    public final String name;
    public final float speedKmh;

    public Waypoint(double latitude, double longitude, String name, float speedKmh) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.speedKmh = speedKmh;
    }

    public Waypoint(double latitude, double longitude, String name) {
        this(latitude, longitude, name, 25.0f);
    }
}

