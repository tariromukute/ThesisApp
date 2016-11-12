// Set the RFduino port 1 (S1) to be a custom I2C sensor
#pragma config(Sensor, S1,TIR,sensorI2CCustom)

// Allow us to use "RFDUINO_PORT" instead of writing "S1"
#define RFDUINO_PORT S1


//___________________________ ____________ ________________________________________
//___________________________|            |________________________________________
//___________________________| I2C Basics |________________________________________
//___________________________|____________|________________________________________

// First, define the Rfduino Address
// Address is 0x04 on the Rfduino: (Binary) 0100
// Bit shifted out with one 0, that becomes: (Binary) 1000
// because the slave address is just 7 bits long
// Which is 0x08
#define RFDUINO_ADDRESS	0x08     // Arduino: 0x04


ubyte I2Cmessage[22];
byte I2Creply[20];
SensorType[S1] = sensorI2CCustom;

void read_drive_instructions(int message_size, int return_size, ubyte service_type, *ubyte velocity, *ubyte angle)
{
	memset(I2Creply, 0, sizeof(I2Creply));

	//These 3 bytes are the messageâ??s header. These are( slave_address, message_size, return_size )
	message_size = message_size+3;

	I2Cmessage[0] = message_size; // Messsage Size
	I2Cmessage[1] = RFDUINO_ADDRESS;
	I2Cmessage[2] = service_type;
	//// can't add more than 5 Bytes

	// return_size is the expected byte reply, set to zero if rely not wanted
	sendI2CMsg(S1, I2Cmessage, return_size);

	while (nI2CStatus[S1] == STAT_COMM_PENDING)
		wait1Msec(20);

	readI2CReply(RFDUINO_PORT, I2Creply, return_size);


	velocity = I2Creply[0];
	angle = I2Creply[1];

	wait1Msec(35);
}

//___________________________ ___________________ _________________________________
//___________________________|                   |_________________________________
//___________________________| Devices Functions |_________________________________
//___________________________|___________________|_________________________________





//___________________________ _________ ___________________________________________
//___________________________|         |___________________________________________
//___________________________| Example |___________________________________________
//___________________________|_________|___________________________________________



task main()
{
	int ultrasonic_value;
	byte velocity = 0x00;
	byte angle = 0x00;

	while(true)
	{
		read_drive_instructions(0, 2, 0x01, &velocity, &angle);
		wait1Msec(40);

	}
}
