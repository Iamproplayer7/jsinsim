const ezstruct = require('ezstruct');
ezstruct.setStringEncoding('ASCII');

// data
const OFFICIAL_VEHICLES =  ['UF1', 'XFG', 'XRG', 'LX4', 'LX6', 'RB4', 'FXO', 'XRT', 'RAC', 'FZ5', 'UFR', 'XFR', 'FXR', 'XRR', 'FZR', 'MRT', 'FBM', 'FOX', 'FO8', 'BF1'];

const packets = {};
packets.IS_ISI = (data) => {
    data.size = 44;
    data.type = 1;

    const struct = `
    typedef struct {
        unsigned char size;
        unsigned char type;
        unsigned char reqi;
        unsigned char zero;

        unsigned short udpport;
        unsigned short flags;

        unsigned char insimver;
        unsigned char prefix;
        unsigned short interval;

        char admin[16];
        char iname[16];
    } data;`;

    return pack(struct, data);
};

packets.IS_VER = (data) => {
    data.size = 20;
    data.type = 2;

    const struct =  `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            char version[8];
            char product[6];
            unsigned char insimver;
            unsigned char spare;
        } data;`;

    return unpack(struct, data);
}

packets.IS_TINY = (data) => {
    data.size = 4;
    data.type = 3;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char subt;
        } data;`;

    return pack(struct, data);
};

packets.IS_SMALL_PACK = (data) => {
    data.size = 8;
    data.type = 4;

	const struct =  `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char subt;

            unsigned long uval;
        } data;`;

    return pack(struct, data);
};

packets.IS_SMALL = (data) => {
    data.size = 8;
    data.type = 4;

	const struct =  `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char subt;

            unsigned long uval;
        } data;`;

    return unpack(struct, data);
};

packets.IS_ISM = (data) => {
    data.size = 40;
    data.type = 10;

	const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char host;
            unsigned char sp1;
            unsigned char sp2;
            unsigned char sp3;

            char hname[32];
        } data;`;

    return unpack(struct, data);
}

// IS_STA
// IS_SFP
// IS_MOD

packets.IS_MSO = (data) => {
    data.size = 136;
    data.type = 11;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char ucid;
            unsigned char plid;
            unsigned char usertype;
            unsigned char textstart;

            char msg[128];
        } data;`;

    return unpack(struct, data);
}

// IS_III
// IS_ACR

packets.IS_MST = (data) => {
    if(data.text === undefined) {
        data.text = '';
    }

    data.text = data.text.slice(0, 63);

    data.size = 68;
    data.type = 13;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            char text[64];
        } data;`;

    return pack(struct, data);
}

// IS_MSX
// IS_MSL


packets.IS_MTC = (data) => {
    if(data.text === undefined) {
        data.text = '';
    }

    var len = data.text.length + 1;

    if(len >= 127) len = 127;
    if((len % 4) != 0) len += 4 - (len % 4);

    data.size = 8 + len;
    data.type = 14;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char sound;

            unsigned char ucid;
            unsigned char plid;
            unsigned char sp2;
            unsigned char sp3;

            char text[${len}];
        } data;`;

    return pack(struct, data);
}

// IS_SCH

packets.IS_VTN = (data) => {
    data.size = 8;
    data.type = 16;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char ucid;
            unsigned char action;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

// ISP_RST

packets.IS_PLC = (data) => {
    data.size = 12;
    data.type = 53;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char ucid;
            unsigned char sp1;
            unsigned char sp2;
            unsigned char sp3;

            unsigned long cars;
        } data;`;

    return pack(struct, data);
}

packets.IS_RST = (data) => {
    data.size = 28;
    data.type = 17;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char racelaps;
            unsigned char qualmins;
            unsigned char nump;
            unsigned char timing;

            char track[6];
            unsigned char weather;
            unsigned char wind;

            signed short flags;
            signed short numnodes;
            signed short finish;
            signed short split1;
            signed short split2;
            signed short split3;
        } data;`;

    return unpack(struct, data);
}

packets.IS_NCN = (data) => {
    data.size = 56;
    data.type = 18;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            char uname[24];
            char pname[24];

            unsigned char admin;
            unsigned char total;
            unsigned char flags;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

packets.IS_NCI = (data) => {
    data.size = 16;
    data.type = 19;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char language;
            unsigned char sp1;
            unsigned char sp2;
            unsigned char sp3;

            unsigned long userid;
            unsigned long ipaddress;
        } data;`;
    
    const buf = unpack(struct, data);
    buf.ipaddress = data.slice(12, 16).join('.');

    return buf;
}

packets.IS_CNL = (data) => {
    data.size = 8;
    data.type = 19;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char reason;
            unsigned char total;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

packets.IS_CPR = (data) => {
    data.size = 36;
    data.type = 20;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            char pname[24];
            char plate[8];
        } data;`;

    return unpack(struct, data);
}

packets.IS_NPL = (data) => {
    data.size = 76;
    data.type = 21;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char ucid;
            unsigned char ptype;
            signed short flags;

            char pname[24];
            char plate[8];

            unsigned long cname;
            char sname[16];
            char tyres[4];

            unsigned char hmass;
            unsigned char htres;
            unsigned char model;
            unsigned char pass;

            unsigned char RWAdj;
            unsigned char FWAdj;
            unsigned char sp2;
            unsigned char sp3;

            unsigned char setf;
            unsigned char nump;
            unsigned char config;
            unsigned char fuel;
        } data;`;
    

    const buffer = unpack(struct, data);
    
    var exists = false;
    OFFICIAL_VEHICLES.forEach(cname => {
        const oid = Buffer.concat([Buffer.from(cname), new Buffer.alloc(1)]).readUInt32LE(0).toString(16);
        if(oid == buffer.cname.toString(16)) {
            exists = cname;
        }
    })
    
    /*
    const buf = Buffer.alloc(8);
    buf[0] = Buffer.from(buffer.cname)[0];
    buf[1] = Buffer.from(buffer.cname)[1];
    buf[2] = Buffer.from(buffer.cname)[2];

    console.log(((buf.readUInt32LE(0) << 8) + buf.readUInt32LE(4)).toString(16))*/
    
    buffer.cname = exists ? exists : buffer.cname.toString(16);
    buffer.cname = buffer.cname.toUpperCase();
    buffer.isOfficial = !!exists;

    return buffer;
}

packets.IS_PLP = (data) => {
    data.size = 76;
    data.type = 22;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;
        } data;`;

    return unpack(struct, data);
}

packets.IS_PLL = (data) => {
    data.size = 76;
    data.type = 23;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;
        } data;`;

    return unpack(struct, data);
}

packets.IS_CRS = (data) => {
    data.size = 76;
    data.type = 41;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;
        } data;`;

    return unpack(struct, data);
}

packets.IS_LAP = (data) => {
    data.size = 20;
    data.type = 24;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned long ltime;
            unsigned long etime;

            signed short lapsdone;
            signed short flags;

            unsigned char sp0;
            unsigned char penalty;
            unsigned char numstops;
            unsigned char fuel200;
        } data;`;

    return unpack(struct, data);
}

packets.IS_SPX = (data) => {
    data.size = 16;
    data.type = 25;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned long stime;
            unsigned long etime;

            unsigned char split;
            unsigned char penalty;
            unsigned char numstops;
            unsigned char fuel200;
        } data;`;

    return unpack(struct, data);
}

packets.IS_PIT = (data) => {
    data.size = 24;
    data.type = 26;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned short lapsdone;
            unsigned short flags;

            unsigned char fuelAdd;
            unsigned char penalty;
            unsigned char numstops;
            unsigned char sp3;

            char tyres[4];

            unsigned long work;
            unsigned long spare;
        } data;`;

    return unpack(struct, data);
}

packets.IS_PSF = (data) => {
    data.size = 12;
    data.type = 27;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned long stime;
            unsigned long spare;
        } data;`;

    return unpack(struct, data);
}

packets.IS_PLA = (data) => {
    data.size = 8;
    data.type = 28;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char fact;
            unsigned char sp1;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

// IS_CCH

packets.IS_PEN = (data) => {
    data.size = 8;
    data.type = 30;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char oldpen;
            unsigned char newpen;
            unsigned char reason;
            unsigned char sp3;

        } data;`;

    return unpack(struct, data);
}

packets.IS_TOC = (data) => {
    data.size = 8;
    data.type = 31;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char olducid;
            unsigned char newucid;
            unsigned char sp2;
            unsigned char sp3;

        } data;`;

    return unpack(struct, data);
}

packets.IS_FLG = (data) => {
    data.size = 8;
    data.type = 32;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char offon;
            unsigned char flag;
            unsigned char carbehind;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

packets.IS_PFL = (data) => {
    data.size = 8;
    data.type = 33;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            signed short flags;
            signed short spare;
        } data;`;

    return unpack(struct, data);
}

packets.IS_FIN = (data) => {
    data.size = 20;
    data.type = 34;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned long ttime;
            unsigned long btime;

            unsigned char spa;
            unsigned char numstops;
            unsigned char confirm;
            unsigned char spb;

            signed short lapsdone;
            signed short flags;
        } data;`;

    return unpack(struct, data);
}

packets.IS_RES = (data) => {
    data.size = 84;
    data.type = 35;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            char uname[24];
            char pname[24];
            char plate[8];
            char cname[4];

            unsigned long ttime;
            unsigned long btime;

            unsigned char spa;
            unsigned char numstops;
            unsigned char confirm;
            unsigned char spb;

            signed short lapsdone;
            signed short flags;

            unsigned char resultnum;
            unsigned char numres;
            signed short pseconds;
        } data;`;

    return unpack(struct, data);
}

packets.IS_REO = (data) => {
    data.size = 44;
    data.type = 36;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char nump;
        } data;`;

    const buffer = unpack(struct, data);
    buffer.plids = data.slice(4, data.length);

    return buffer;
}

// IS_AXI

packets.IS_AXO = (data) => {
    data.size = 4;
    data.type = 43;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;
        } data;`;

    return unpack(struct, data);
}

packets.IS_MCI = (data) => {
    data.size = 32;
    data.type = 38;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char numc;
        } data;`;

    const buf = unpack(struct, data);
    buf.compcar = [];

    for(let i = 0; i < buf.numc; i++) {
		const start = 4 + (i * 28);
        buf.compcar.push(packets.CompCar(data.slice(start, (start + 28))));
    }

    return buf;
}

packets.IS_CON = (data) => {
    data.size = 40;
    data.type = 50;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned short spclose;
            unsigned short time;
        } data;`;

    const buffer = unpack(struct, data);
    buffer.c1 = packets.CarContact(data.slice(8, 8+16));
    buffer.c2 = packets.CarContact(data.slice(8+16, 8+16+16));

    return buffer;
}

packets.IS_OBH = (data) => {
    data.size = 24;
    data.type = 51;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned short spclose;
            unsigned short time;

            char c[8];

            signed short x;
            signed short y;

            unsigned char zbyte;
            unsigned char sp1;
            unsigned char index;
            unsigned char obhflags;
        } data;`;


    const buf = unpack(struct, data);
    buf.c = packets.CarContOBJ(data.slice(8, 16));

    return buf;
}

packets.IS_OCO = (data) => {
    data.size = 8;
    data.type = 60;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char zero;

            unsigned char ocoaction;
            unsigned char index;
            unsigned char identifier;
            unsigned char data;
        } data;`;

    return pack(struct, data);
}

// IS_HLV

packets.IS_AXM = (data) => {
    data.size = 8;
    data.type = 54;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char numo;

            unsigned char ucid;
            unsigned char pmoaction;
            unsigned char pmoflags;
            unsigned char sp3;
        } data;`;

    const buffer = unpack(struct, data);
    buffer.objects = [];

    for(var i = 0; i < buffer.numo; i++) {
		const start = 8 + (i * 8);
        buffer.objects.push(packets.ObjectInfo(data.slice(start, (start + 28))));
    }
    
    return buffer;
}

packets.IS_AXM_PACK = (data) => {
    data.numo = data.objects.length;
    data.size = 8 + data.numo * 8;
    data.type = 54;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char numo;

            unsigned char ucid;
            unsigned char pmoaction;
            unsigned char pmoflags;
            unsigned char sp3;
        } data;`;

    var buffer = pack(struct, data);
    data.objects.forEach((object) => {
        buffer = Buffer.concat([buffer,  packets.ObjectInfoPack(object)]);
    });

    return buffer;
}

// IS_SCC
// IS_CPP
// IS_RIP
// IS_SSH

packets.IS_BFN = (data) => {
    data.size = 8;
    data.type = 42;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char subt;

            unsigned char ucid;
            unsigned char clickid;
            unsigned char clickmax;
            unsigned char inst;
        } data;`;

    if(data[3] == 2 || data[3] == 3) {
        return unpack(struct, data);
    }
    else {
        return pack(struct, data);
    }
}

packets.IS_BTN = (data) => {
    data.text = data.text.toString();
    var len = data.text.length + 1;

	if (len > 240)
		len = 240;

	if ((len % 4) != 0)
        len += 4 - (len % 4);
        
    data.size = 12 + len;
    data.type = 45;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char clickid;
            unsigned char inst;
            unsigned char bstyle;

            unsigned char typein;
            unsigned char l;
            unsigned char t;
            unsigned char w;
            unsigned char h;

            char text[${len}];
        } data;`;

    return pack(struct, data);
}

packets.IS_BTT = (data) => {
    data.size = 104;
    data.type = 47;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char clickid;
            unsigned char inst;
            unsigned char typein;
            unsigned char sp3;

            char text[96];
        } data;`;

    return unpack(struct, data);
}

packets.IS_BTC = (data) => {
    data.size = 8;
    data.type = 46;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char clickid;
            unsigned char inst;
            unsigned char cflags;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

packets.IS_JRR = (data) => {
    data.size = 16;
    data.type = 58;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char plid;

            unsigned char ucid;
            unsigned char jrraction;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    var j = packets.ObjectInfoPack({ x: 0, y: 0, z: 0, flags: 0, heading: 0 });
    if(data.x !== undefined && data.y !== undefined || data.z !== undefined) {
        j = packets.ObjectInfoPack({ x: data.x * 16, y: data.y * 16, z: data.z * 4, flags: 128, index: 0, heading: data.heading });
    }

    return Buffer.concat([pack(struct, data),  j]);
}

packets.IS_CIM = (data) => {
    data.size = 8;
    data.type = 64;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            unsigned char mode;
            unsigned char submode;
            unsigned char seltype;
            unsigned char sp3;
        } data;`;


    return unpack(struct, data);
}

packets.IS_MAL_PACK = (data) => {
    data.numm = data.mods.length > 120 ? 120 : data.mods.length;
    data.size = 8 + (data.numm * 4);
    data.type = 65;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char numm;

            unsigned char ucid;
            unsigned char flags;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    var buffer = pack(struct, data);
    data.mods.slice(0, 120).forEach(mod => {
        const modbuffer = Buffer.from('00' + mod, 'hex').reverse();
        buffer = Buffer.concat([buffer, modbuffer]);
    });

    return buffer;
}

packets.IS_SLC = (data) => {
    data.size = 8;
    data.type = 62;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char ucid;

            char cname[4];
        } data;`;

    return unpack(struct, data);
}

packets.IS_MAL = (data) => {
    data.size = 8;
    data.type = 65;

    const struct = `
        typedef struct {
            unsigned char size;
            unsigned char type;
            unsigned char reqi;
            unsigned char numm;

            unsigned char ucid;
            unsigned char flags;
            unsigned char sp2;
            unsigned char sp3;
        } data;`;

    return unpack(struct, data);
}

packets.CompCar = (data) => {
    const struct = `
        typedef struct {
            unsigned short node;
            unsigned short lap;

            unsigned char plid;
            unsigned char position;
            unsigned char info;
            unsigned char sp3;

            signed long x;
            signed long y;
            signed long z;

            unsigned short speed;
            unsigned short direction;
            unsigned short heading;
            signed short angvel;
        } data;`;

    const buf = unpack(struct, data);

    // data
    buf.speed = buf.speed / 32768 * 360;
    buf.x = buf.x / 65536;
    buf.y = buf.y / 65536;
    buf.z = buf.z / 65536;
    buf.heading = buf.heading / 32768 * 180;
    buf.direction = buf.direction / 182.0444444;

    return buf;
}

packets.ObjectInfo = (data) => {
    const struct = `
        typedef struct {
            signed short x;
            signed short y;
            unsigned char z;

            unsigned char flags;
            unsigned char index;
            unsigned char heading;
        } data;`;

    return unpack(struct, data);
}

packets.ObjectInfoPack = (data) => {
    const struct = `
        typedef struct {
            signed short x;
            signed short y;
            unsigned char z;

            unsigned char flags;
            unsigned char index;
            unsigned char heading;
        } data;`;

    return pack(struct, data);
}

packets.CarContOBJ = (data) => {
    const struct = `
        typedef struct {
            unsigned char direction;
            unsigned char heading;
            unsigned char speed;
            unsigned char zbyte;

            signed short x;
            signed short y;
        } data;`;

    return unpack(struct, data);
}

packets.CarContact = (data) => {
    const struct = `
        typedef struct {
            unsigned char plid;
            unsigned char info;
            unsigned char sp2;
            unsigned short steer;

            unsigned char thrbrk;
            unsigned char cluhan;
            unsigned char gearsp;
            unsigned char speed;

            unsigned char direction;
            unsigned char heading;
            unsigned short accelf;
            unsigned short accelr;
        } data;`;

    return unpack(struct, data);
}


////////////////////////////////////////
const pack = (struct, data) => {
    if(data.size !== undefined) {
        data.size = data.size / 4;
    }
   
    const __f = ezstruct(struct);
    const buffer = __f.data.toBinary(data);

    return buffer;
}

const unpack = (struct, data) => {
    const __f = ezstruct(struct);

    // to avoid ezstruct byte length mismatch
    if(data.length < __f.data.bytes) {
        data = Buffer.concat([data, Buffer.alloc(__f.data.bytes-data.length)])
    }

    const buffer = __f.data.fromBinary(data);

    return buffer;
}

//////////////////////////////

const PACKETS = [ 
    'IS_NONE', 'IS_ISI', 'IS_VER', 'IS_TINY', 'IS_SMALL', 'IS_STA', 'IS_SCH',
    'IS_SFP', 'IS_SCC', 'IS_CPP', 'IS_ISM', 'IS_MSO', 'IS_III', 'IS_MST', 'IS_MTC',
    'IS_MOD', 'IS_VTN', 'IS_RST', 'IS_NCN', 'IS_CNL', 'IS_CPR', 'IS_NPL', 'IS_PLP',
    'IS_PLL', 'IS_LAP', 'IS_SPX', 'IS_PIT', 'IS_PSF', 'IS_PLA', 'IS_CCH', 'IS_PEN',
    'IS_TOC', 'IS_FLG', 'IS_PFL', 'IS_FIN', 'IS_RES', 'IS_REO', 'IS_NLP', 'IS_MCI',
    'IS_MSX', 'IS_MSL', 'IS_CRS', 'IS_BFN', 'IS_AXI', 'IS_AXO', 'IS_BTN', 'IS_BTC',
    'IS_BTT', 'IS_RIP', 'IS_SSH', 'IS_CON', 'IS_OBH', 'IS_HLV', 'IS_PLC', 'IS_AXM',
    'IS_ACR', 'IS_HCP', 'IS_NCI', 'IS_JRR', 'IS_UCO', 'IS_OCO', 'IS_TTC', 'IS_SLC',
    'IS_CSC', 'IS_CIM', 'IS_MAL'
];

const getById = (id) => {
    return PACKETS[id] === undefined ? false : PACKETS[id];
};

const getPacketBuffered = (name, data) => {
    return packets[name] === undefined ? false : packets[name](data);
};

module.exports = { 
    packets: packets, 
    getById: getById, 
    getPacketBuffered: getPacketBuffered 
};