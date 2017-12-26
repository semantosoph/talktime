class Talk {

    constructor() {
        this.configelement = document.getElementById("config");
        this.clockelement = document.getElementById("clock");
        this.minuteselement = this.clockelement.querySelector('.minutes');
        this.secondselement = this.clockelement.querySelector('.seconds');
        this.alerts = [];
        this.colors = [];
        this.alertsize = 6;
        this.load();
        this.saveinterval = setInterval(
            (function(self) {
                return function() {
                    self.save();
                 }
            })
            (this),
            10000
        ); 
        this.showconfig();
    }

    load() {
        if (typeof(Storage) !== "undefined" && localStorage.getItem("talktime")) {
            this.length = localStorage.getItem("talktime");
            this.alerts.push(localStorage.getItem("alertminone"));
            this.alerts.push(localStorage.getItem("alertmintwo"));
            this.alerts.push(localStorage.getItem("alertminthree"));
            this.colors.push(localStorage.getItem("alertcolorone"));
            this.colors.push(localStorage.getItem("alertcolortwo"));
            this.colors.push(localStorage.getItem("alertcolorthree"));
        }

        this.length = 30;
        this.alerts.push(15);
        this.alerts.push(10);
        this.alerts.push(5);
        this.alerts.push(2);
        this.alerts.push(1);
        this.alerts.push(0);
        this.colors.push("#00ff00");
        this.colors.push("#ffff00");
        this.colors.push("#ffff00");
        this.colors.push("#ff0000");
        this.colors.push("#ff0000");
        this.colors.push("#ff0000");
    }

    save() {
        console.log("save...");
        localStorage.setItem("talktime", this.length);
        localStorage.setItem("alertminone", this.alerts[0]);
        localStorage.setItem("alertmintwo", this.alerts[1]);
        localStorage.setItem("alertminthree", this.alerts[2]);
        localStorage.setItem("alertcolorone", this.colors[0]);
        localStorage.setItem("alertcolortwo", this.colors[1]);
        localStorage.setItem("alertcolorthree", this.colors[2]);
    }

    start() {
        this.deadline = new Date(Date.parse(new Date()) + (this.length * 60 * 1000));
        this.clockelement.style.display = "block";
        this.configelement.style.display = "none";
        this.updateClock();
        this.timeinterval = setInterval(
            (function(self) {
                return function() {
                    self.updateClock();
                 }
            })(this), 1000);    
    }

    timeRemaining() {
        var t = Date.parse(this.deadline) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        return {
        'total': t,
        'minutes': minutes,
        'seconds': seconds,
        };
    }

    confignode(no) {
        if (no < this.alertsize) {
            var node = document.createElement("div");
            var mininput = document.createElement("input");
            mininput.setAttribute("id", "mininput" + no);
            mininput.setAttribute('type', 'text');
            mininput.setAttribute('value', this.alerts[no]);
            node.appendChild(mininput);
            var colinput = document.createElement("input");
            colinput.setAttribute("id", "colinput" + no);
            colinput.setAttribute('type', 'text');
            colinput.setAttribute('value', this.colors[no]);
            node.appendChild(colinput);
            return node;
        }
    }

    showconfig() {
        this.clockelement.style.display = "none";
        var timetext = document.createElement("h2");
        timetext.innerHTML = "Length of talk: " + this.length + " minutes";
        this.configelement.appendChild(timetext);
        for (var i = 0; i < this.alertsize; i++) {
            this.configelement.appendChild(this.confignode(i));
        }
        var startbtn = document.createElement("button");
        startbtn.innerHTML = "Start Countdown";
        startbtn.addEventListener("click",
            (function(self) {
                return function() {
                    self.start();
                }
            })(this));
        this.configelement.appendChild(startbtn);
    }

    updateClock() {
        var t = this.timeRemaining();    
        this.minuteselement.innerHTML = t.minutes;
        this.secondselement.innerHTML = ("0" + t.seconds).slice(-2);
    
        var alertindex = this.alerts.indexOf(t.minutes);
        if (alertindex >=0) {
            this.clockelement.style.backgroundColor = this.colors[alertindex];
            this.clockelement.style.color = "#000";
        } else {
            this.clockelement.style.backgroundColor = "#000";            
            this.clockelement.style.color = "#fff";
        }
        if (t.total <= 0) {
          clearInterval(this.timeinterval);
        }
    }
};

window.onload = function() {
   var talk = new Talk();
}    