import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class image_alive extends PApplet {

public void setup() {
  

  // Background Img
  PImage back = loadImage("bg_alive.jpg");
  image(back, 0, 0, width, height);

  // Logo image at the bottom right
  PImage logo = loadImage("../udg.png");
  image(logo, width-200, height-200, 200, 200);

  Table table = loadTable("../data.csv", "header");

  textSize(40);
  outlineText("VIUS", 1290/2-25, 50, true);

  translate(35, 80);

  textSize(25);

  int aux_i = 0;

  for (int i=0; i<table.getRowCount(); i++) {   
    if (aux_i >= 10) {
      translate(420, 0);
      aux_i=0;
    }

    TableRow row = table.getRow(i);

    String name = row.getString("Name");
    int viu = row.getInt("Viu");
    int baixes = row.getInt("Baixes");

    if (viu == 1) {
      outlineText(name + " (" + baixes + ")", 10, 30 + aux_i*60, false);
      aux_i++;
    }
  }

  save("output_alive.png");
  exit();
}


public void outlineText(String text, int pos_x, int pos_y, boolean isTitle) {
  if (isTitle) { // Outline color
    fill(0);
  } else {
    fill(51);
  }

  for (int x = -1; x < 2; x++) {
    text(text, pos_x+x, pos_y);
    text(text, pos_x, pos_y+x);
  }

  if (isTitle) { // Fill color
    fill(0, 255, 0); // Green title
  } else {
    fill(255);
  }

  text(text, pos_x, pos_y);
}
  public void settings() {  size(1290, 720); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "image_alive" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
