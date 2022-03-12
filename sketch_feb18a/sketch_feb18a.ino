#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#define BLYNK_PRINT Serial
#include <Blynk.h>
#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <ArduinoWebsockets.h>
 
#include "Wire.h"
#include "Adafruit_GFX.h"
#include "OakOLED.h"

 
#define REPORTING_PERIOD_MS 1000
OakOLED oled;

// Conexões: SCL PIN - D1, SDA PIN - D2, INT PIN - D0
PulseOximeter pox;

float BPM, SpO2;
uint32_t tsLastReport = 0;

const unsigned char bitmap [] PROGMEM=
{
0x00, 0x00, 0x00, 0x00, 0x01, 0x80, 0x18, 0x00, 0x0f, 0xe0, 0x7f, 0x00, 0x3f, 0xf9, 0xff, 0xc0,
0x7f, 0xf9, 0xff, 0xc0, 0x7f, 0xff, 0xff, 0xe0, 0x7f, 0xff, 0xff, 0xe0, 0xff, 0xff, 0xff, 0xf0,
0xff, 0xf7, 0xff, 0xf0, 0xff, 0xe7, 0xff, 0xf0, 0xff, 0xe7, 0xff, 0xf0, 0x7f, 0xdb, 0xff, 0xe0,
0x7f, 0x9b, 0xff, 0xe0, 0x00, 0x3b, 0xc0, 0x00, 0x3f, 0xf9, 0x9f, 0xc0, 0x3f, 0xfd, 0xbf, 0xc0,
0x1f, 0xfd, 0xbf, 0x80, 0x0f, 0xfd, 0x7f, 0x00, 0x07, 0xfe, 0x7e, 0x00, 0x03, 0xfe, 0xfc, 0x00,
0x01, 0xff, 0xf8, 0x00, 0x00, 0xff, 0xf0, 0x00, 0x00, 0x7f, 0xe0, 0x00, 0x00, 0x3f, 0xc0, 0x00,
0x00, 0x0f, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};
 
const char* ssid = "Atena_2G"; // Nome da Rede
const char* password = "paranguarico3l1s3ulwj#4tena";  // Senha Rede.
const char* websockets_server_host = "192.168.1.68"; // IP do servidor websocket
const int websockets_server_port = 8080; // Porta de conexão do servidor

// Utilizamos o namespace de websocket para podermos utilizar a classe WebsocketsClient
using namespace websockets;

// Objeto websocket client
WebsocketsClient client;

void onBeatDetected()
{
    Serial.println("Batida detectada!");
    oled.drawBitmap( 60, 20, bitmap, 28, 28, 1);
    oled.display();
}

bool connected;

void setup()
{
    pinMode(D6, OUTPUT);
    pinMode(D7, OUTPUT);
    pinMode(D8, OUTPUT);
    
    Serial.begin(115200);
    oled.begin();
    oled.clearDisplay();
    oled.setTextSize(1);
    oled.setTextColor(1);
    oled.setCursor(0, 0);

    oled.println("Inicializando oxímetro de pulso..");
    oled.display();
    
    pinMode(16, OUTPUT);

    // Conectando ao WiFi
    WiFi.begin(ssid, password);

    // Enquanto não conectar, printar um "."
    while(WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(1000);
    }

    // Exibir "WiFi Conectado"
    Serial.println("Conectado ao Wifi, Conectando ao servidor.");

    // Tentando conectar com o websockets server
    connected = client.connect(websockets_server_host, websockets_server_port, "/");

    
    // Se foi possível conectar
    if(connected) 
    {
        // Exibir mensagem de sucesso
        Serial.println("Conectado!!!");
        // Enviar uma msg "Hello Server" para o servidor
        //client.send("Hello Server");
    }   // Se não foi possível conectar
    else 
    {
        // Exibimos mensagem de falha
        Serial.println("Não Conectado!!!");
        return;
    }

    // Iniciamos o callback onde as mesagens serão recebidas
    client.onMessage([&](WebsocketsMessage message)
    {        
        // Exibimos a mensagem recebida na serial
        Serial.print("Got Message: ");
        Serial.println(message.data());

        // Ligamos/Desligamos o led de acordo com o comando
        //if(message.data().equalsIgnoreCase("ON"))
            //digitalWrite(led, HIGH);
        //else
        //if(message.data().equalsIgnoreCase("OFF"))
            //digitalWrite(led, LOW);
    });

    
    Serial.print("Inicializando oxímetro de pulso..");
 
    if (!pox.begin())
    {
         Serial.println("FAILED");
         oled.clearDisplay();
         oled.setTextSize(1);
         oled.setTextColor(1);
         oled.setCursor(0, 0);
         oled.println("FAILED");
         oled.display();
         for(;;);
    }
    else
    {
         oled.clearDisplay();
         oled.setTextSize(1);
         oled.setTextColor(1);
         oled.setCursor(0, 0);
         oled.println("SUCCESS");
         oled.display();
         Serial.println("SUCCESS");
         pox.setOnBeatDetectedCallback(onBeatDetected);
    }
 
     // A corrente padrão para o LED IV é 50mA e pode ser alterada removendo o comentário da linha a seguir.
     pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
 
}
 
void loop()
{
    pox.update();
    
    BPM = pox.getHeartRate();
    SpO2 = pox.getSpO2();
    
    String bpmServer = "";
    String Sp02Server = "";
    bpmServer.concat(BPM);
    Sp02Server.concat(SpO2);
    
    if (millis() - tsLastReport > REPORTING_PERIOD_MS)
    {
        Serial.print("Frequência cardíaca:");
        Serial.print(BPM);
        Serial.print(" bpm / SpO2:");
        Serial.print(SpO2);
        Serial.println(" %");
        
        oled.clearDisplay();
        oled.setTextSize(1);
        oled.setTextColor(1);
        oled.setCursor(0,16);
        oled.println(pox.getHeartRate());
 
        oled.setTextSize(1);
        oled.setTextColor(1);
        oled.setCursor(0, 0);
        oled.println("Heart BPM");
 
        oled.setTextSize(1);
        oled.setTextColor(1);
        oled.setCursor(0, 30);
        oled.println("Spo2");
 
        oled.setTextSize(1);
        oled.setTextColor(1);
        oled.setCursor(0,45);
        oled.println(pox.getSpO2());
        oled.display();
        
        client.send(Sp02Server); //Enviando Dados Para o Servidor  
        
        tsLastReport = millis();
        
        // if(SpO2 <= 95){
         // digitalWrite(D6, LOW);
          //digitalWrite(D8, LOW);
          //digitalWrite(D7, HIGH);
        //}
        
        //if(SpO2 >= 95){
        //  digitalWrite(D7, LOW);
        //  digitalWrite(D6, LOW);
        //  digitalWrite(D8, HIGH);
       // }
        
        //if(SpO2 == 95){
          //digitalWrite(D7, LOW);
          //digitalWrite(D8, LOW);
          //digitalWrite(D6, HIGH);
        //}
    }
}
