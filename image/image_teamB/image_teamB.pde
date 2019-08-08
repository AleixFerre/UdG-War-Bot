PImage back, logo, house, destroyed;
Table table;


void settings() {
  // Background Img
  back = loadImage("back2.jpg");

  // Logo image at the bottom right
  logo = loadImage("../udg3.png");
  
  // House img
  house = loadImage("house2.png");
  destroyed = loadImage("house2_destroyed.png");

  table = loadTable("../data.csv", "header");
  
  size(1290, 720);
}

void setup() {

  image(back, 0, 0, width, height);
  
  int mida = 150;
  tint(255,128);
  image(logo, width-mida, height-mida, mida, mida);

  textSize(40);
  float cw = textWidth("Equip B");
  outlineText("Equip B", floor(width/2-cw/2), 70, true, false);

  pushMatrix();
  
  translate(70, 180);

  textSize(15);
  textAlign(CENTER, CENTER);

  int j = 0;
  int n_vius = 0;
  
  tint(255);

  for (int i=0; i<table.getRowCount(); i++) {   
    if (j >= 5) {
      translate(420, 0);
      j=0;
    }

    TableRow row = table.getRow(i);

    String name = row.getString("Name");
    int viu = row.getInt("Viu");
    int equip = row.getInt("Equip");
    int baixes = row.getInt("Baixes");
    
    if (equip == 1) {
      
      if (j%2==0) {
        casa(10, 30+j*115, viu, name, baixes);
      } else {
        casa(210, 30+j*115, viu, name, baixes);
      }
      
      if ( viu == 1 ) {
        // Muerto
        n_vius++;
      }
      
      j++;
    }
  }
  
  popMatrix();
  
  if (n_vius == 0) {
    PImage wasted = loadImage("../wasted.png");
    image(wasted, 0,0, width, height);
  }

  save("output_teamB.jpg");
  exit();
}



void casa(int x, int y, int viu, String name, int baixes) {
  
  int mida_casa = 100;
  
  if (viu == 0) {
    // Destruida
    image(destroyed, x, y-mida_casa, mida_casa, mida_casa);
    outlineText(name + " (" + baixes + ")", x+mida_casa/2, y+25, false, false);
  } else {
    // Normal
    image(house, x, y-mida_casa, mida_casa, mida_casa);
    outlineText(name + " (" + baixes + ")", x+mida_casa/2, y+25, false, true);
  }
  
  
  
}




void outlineText(String text, int pos_x, int pos_y, boolean isTitle, boolean viu) {
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
    fill(77,175,30); // Green title
  } else {
    fill(255);
    if (!viu) { // Outline color, if viu
      fill(255,0,0);
    }
  }

  text(text, pos_x, pos_y);
}
