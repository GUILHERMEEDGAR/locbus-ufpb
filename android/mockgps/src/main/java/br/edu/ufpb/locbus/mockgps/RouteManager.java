package br.edu.ufpb.locbus.mockgps;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RouteManager {

    public static class Route {
        public final String id;
        public final String title;
        public final String description;
        public final List<Waypoint> waypoints;

        public Route(String id, String title, String description, List<Waypoint> waypoints) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.waypoints = Collections.unmodifiableList(waypoints);
        }
    }

    public static List<Route> getAvailableRoutes() {
        List<Route> routes = new ArrayList<>();

        // ROTA 1: Completa UFPB (12 Paradas do Campus I + Bancários + CI Mangabeira + Retorno)
        List<Waypoint> ufpbCompleta = new ArrayList<>();
        // 12 Paradas Oficiais do Campus I
        ufpbCompleta.add(new Waypoint(-7.13410, -34.84226, "1. ETS (Início do Circuito Interno)", 0.0f));
        ufpbCompleta.add(new Waypoint(-7.13432, -34.84318, "2. Complexo Esportivo (DEF)", 18.0f));
        ufpbCompleta.add(new Waypoint(-7.13600, -34.84650, "3. Editora UFPB (Alameda Oiticica)", 22.0f));
        ufpbCompleta.add(new Waypoint(-7.13804, -34.84950, "4. CCTA (Comunicação e Artes)", 20.0f));
        ufpbCompleta.add(new Waypoint(-7.13955, -34.85062, "5. Terminal CCHLA (Campus I)", 15.0f));
        ufpbCompleta.add(new Waypoint(-7.14194, -34.85038, "6. CT (Centro de Tecnologia)", 25.0f));
        ufpbCompleta.add(new Waypoint(-7.14187, -34.84888, "7. CCJ (Ciências Jurídicas)", 22.0f));
        ufpbCompleta.add(new Waypoint(-7.14100, -34.84661, "8. CBIOTEC (Biotecnologia)", 20.0f));
        ufpbCompleta.add(new Waypoint(-7.13944, -34.84522, "9. CCEN (Exatas e Natureza)", 20.0f));
        ufpbCompleta.add(new Waypoint(-7.13756, -34.84350, "10. INOVA UFPB (Sucupira)", 24.0f));
        ufpbCompleta.add(new Waypoint(-7.13539, -34.84191, "11. CCS (Ciências da Saúde)", 18.0f));
        ufpbCompleta.add(new Waypoint(-7.13454, -34.84103, "12. Fonoaudiologia", 20.0f));
        
        // Saída rumo a Mangabeira (Bancários)
        ufpbCompleta.add(new Waypoint(-7.14480, -34.84040, "Hospital Universitário (HULW)", 26.0f));
        ufpbCompleta.add(new Waypoint(-7.14580, -34.83950, "Via Expressa Padre Zé", 35.0f));
        ufpbCompleta.add(new Waypoint(-7.14720, -34.83780, "Av. Sérgio Guerra (Entrada Bancários)", 40.0f));
        ufpbCompleta.add(new Waypoint(-7.14920, -34.83560, "Av. Sérgio Guerra (Comércio / Bancos)", 38.0f));
        ufpbCompleta.add(new Waypoint(-7.15100, -34.83350, "Praça da Paz (Bancários)", 30.0f));
        ufpbCompleta.add(new Waypoint(-7.15300, -34.83080, "Av. Sérgio Guerra Sul", 40.0f));
        ufpbCompleta.add(new Waypoint(-7.15550, -34.82720, "Aproximação Viaduto Bancários", 42.0f));
        ufpbCompleta.add(new Waypoint(-7.15780, -34.82420, "Trevo / Viaduto Mangabeira", 35.0f));
        ufpbCompleta.add(new Waypoint(-7.15980, -34.82180, "Av. Alfredo Ferreira da Rocha", 32.0f));
        ufpbCompleta.add(new Waypoint(-7.16150, -34.81960, "Rua do Centro de Informática", 22.0f));
        ufpbCompleta.add(new Waypoint(-7.16270, -34.81820, "Terminal CI Mangabeira (Chegada Ida)", 0.0f));

        // Retorno: CI -> CCHLA
        ufpbCompleta.add(new Waypoint(-7.16270, -34.81820, "Terminal CI Mangabeira (Embarque Retorno)", 0.0f));
        ufpbCompleta.add(new Waypoint(-7.16150, -34.81960, "Saída CI sentido Mangabeira", 20.0f));
        ufpbCompleta.add(new Waypoint(-7.15980, -34.82180, "Av. Alfredo Ferreira da Rocha (Retorno)", 34.0f));
        ufpbCompleta.add(new Waypoint(-7.15780, -34.82420, "Viaduto Mangabeira sentido Bancários", 38.0f));
        ufpbCompleta.add(new Waypoint(-7.15550, -34.82720, "Av. Sérgio Guerra (Shopping Sul)", 40.0f));
        ufpbCompleta.add(new Waypoint(-7.15100, -34.83350, "Praça da Paz (Retorno)", 28.0f));
        ufpbCompleta.add(new Waypoint(-7.14720, -34.83780, "Trevo Castelo Branco", 42.0f));
        ufpbCompleta.add(new Waypoint(-7.14580, -34.83950, "Via Expressa Padre Zé (Campus I)", 40.0f));
        ufpbCompleta.add(new Waypoint(-7.14480, -34.84040, "Entrada Campus I / HULW", 25.0f));
        ufpbCompleta.add(new Waypoint(-7.14250, -34.84200, "Rotatória da Reitoria", 20.0f));
        ufpbCompleta.add(new Waypoint(-7.13955, -34.85062, "Terminal CCHLA (Ciclo Completo Concluído)", 0.0f));

        routes.add(new Route(
                "ufpb_completa",
                "UFPB Completa (12 Paradas + Bancários + CI)",
                ufpbCompleta.size() + " waypoints • Circuito Completo UFPB / CI",
                ufpbCompleta
        ));

        // ROTA 2: Apenas Circuito Interno Campus I (12 Paradas)
        List<Waypoint> ufpbCampus = new ArrayList<>();
        ufpbCampus.add(new Waypoint(-7.13410, -34.84226, "1. ETS (Escola Técnica de Saúde)", 0.0f));
        ufpbCampus.add(new Waypoint(-7.13432, -34.84318, "2. Complexo Esportivo (DEF)", 18.0f));
        ufpbCampus.add(new Waypoint(-7.13600, -34.84650, "3. Editora UFPB", 22.0f));
        ufpbCampus.add(new Waypoint(-7.13804, -34.84950, "4. CCTA (Comunicação e Artes)", 20.0f));
        ufpbCampus.add(new Waypoint(-7.13955, -34.85062, "5. CCHLA", 15.0f));
        ufpbCampus.add(new Waypoint(-7.14194, -34.85038, "6. CT (Centro de Tecnologia)", 25.0f));
        ufpbCampus.add(new Waypoint(-7.14187, -34.84888, "7. CCJ (Ciências Jurídicas)", 22.0f));
        ufpbCampus.add(new Waypoint(-7.14100, -34.84661, "8. CBIOTEC (Biotecnologia)", 20.0f));
        ufpbCampus.add(new Waypoint(-7.13944, -34.84522, "9. CCEN (Exatas e Natureza)", 20.0f));
        ufpbCampus.add(new Waypoint(-7.13756, -34.84350, "10. INOVA UFPB", 24.0f));
        ufpbCampus.add(new Waypoint(-7.13539, -34.84191, "11. CCS (Ciências da Saúde)", 18.0f));
        ufpbCampus.add(new Waypoint(-7.13454, -34.84103, "12. Fonoaudiologia", 20.0f));
        ufpbCampus.add(new Waypoint(-7.13410, -34.84226, "1. ETS (Retorno / Conclusão)", 0.0f));

        routes.add(new Route(
                "ufpb_campus_interno",
                "UFPB Campus I (Apenas 12 Paradas Internas)",
                ufpbCampus.size() + " waypoints • Circuito Fechado Universitário",
                ufpbCampus
        ));

        // ROTA 3: Pedras de Fogo
        List<Waypoint> pedrasDeFogo = new ArrayList<>();
        pedrasDeFogo.add(new Waypoint(-7.4021, -35.1164, "Centro - Pedras de Fogo PB", 0.0f));
        pedrasDeFogo.add(new Waypoint(-7.4035, -35.1150, "Av. Central sentido Itambé", 25.0f));
        pedrasDeFogo.add(new Waypoint(-7.4050, -35.1130, "Ponte Divisa PB/PE", 30.0f));
        pedrasDeFogo.add(new Waypoint(-7.4070, -35.1110, "Praça Central de Itambé PE", 20.0f));
        pedrasDeFogo.add(new Waypoint(-7.4050, -35.1130, "Retorno Ponte Divisa", 30.0f));
        pedrasDeFogo.add(new Waypoint(-7.4021, -35.1164, "Centro - Retorno Final", 0.0f));

        routes.add(new Route(
                "pedras_de_fogo",
                "Pedras de Fogo / Itambé (Validação PB/PE)",
                pedrasDeFogo.size() + " waypoints • Circuito Urbano Fronteiriço",
                pedrasDeFogo
        ));

        return routes;
    }

    /**
     * Calcula a distância em metros entre duas coordenadas geográficas (Fórmula de Haversine).
     */
    public static double haversineMeters(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371000.0; // Raio da Terra em metros
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Calcula o ângulo de orientação (bearing / azimute em graus 0-360) entre duas coordenadas.
     */
    public static float calculateBearing(double lat1, double lon1, double lat2, double lon2) {
        double dLon = Math.toRadians(lon2 - lon1);
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);

        double y = Math.sin(dLon) * Math.cos(lat2Rad);
        double x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
                Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

        double bearing = Math.toDegrees(Math.atan2(y, x));
        return (float) ((bearing + 360) % 360);
    }
}

