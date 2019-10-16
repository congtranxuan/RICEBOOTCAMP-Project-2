function plot(year,choice) {
    
    d3.json("/data").then(function(response, err) {
      if (err) throw err;

        console.log(response);
        
        let data = response;
        //const arrayColumn = (arr, n) => arr.map(x => x[n]);
        let  year_capita = year.concat("capita");

        let yearslice = year.slice(2,4);
        let Bothsexes_year = "Bothsexes".concat(yearslice);
        let Male_year = "Male".concat(yearslice);
        let Female_year = "Female".concat(yearslice);

        let continent =[];
        let countrydata=[];
        let bothsexesdata=[];
        let maledata=[];
        let femaledata=[];
        let percentdata=[];
        let capitadata=[];

        data.forEach(data=>{
          let continent_ = data.Continent;//arrayColumn(data,"Continent");
          let countrydata_ = data.Country;//arrayColumn(data,"Country");
          let bothsexesdata_ = data[Bothsexes_year];//arrayColumn(data,Bothsexes_year);
          let maledata_ = data[Male_year];
          let femaledata_ = data[Female_year];
          let percentdata_ = data[year];//arrayColumn(data,year);
          let capitadata_ = data[year_capita];//arrayColumn(data,year_capita)

          continent.push(continent_);
          countrydata.push(countrydata_);
          bothsexesdata.push(bothsexesdata_);
          maledata.push(maledata_);
          femaledata.push(femaledata_);
          percentdata.push(percentdata_);
          capitadata.push(capitadata_);
        });

        let country =[];
        let bothsexes = [];
        let male = [];
        let female = [];
        let percent = [];
        let capita = [];
        
        for(i in continent) {
          if (choice === "all") {
              country = countrydata;
              bothsexes = bothsexesdata;
              male = maledata;
              female = femaledata;
              percent = percentdata;
              capita = capitadata;
              }
          else if (choice === continent[i]) {
              country.push(countrydata[i]);
              bothsexes.push(bothsexesdata[i]);
              male.push(maledata[i]);
              female.push(femaledata[i]);
              capita.push(capitadata[i]);
              percent.push(percentdata[i]);
              }
            var hovertext1 = [];
            var hovertext2 =[];
            for (var i in country) {
            hovertext1.push(`${country[i]}<br>${year}: ${percent[i]}%`);
            hovertext2.push(`${country[i]}<br>${year}: ${capita[i]}$`);
            };
          };
          
          
        var trace1 = {
          x: bothsexes,
          y: percent,
          hovertext: hovertext1,
          mode: "markers",
          type: "scatter",
          name: "%(GDP)",
          marker: {
            color: "#00bfd8",
            symbol: "hexagram"
          }
        };
        var trace2 = {
          x: bothsexes,
          y: capita,
          hovertext:hovertext2,
          yaxis: 'y2',
          mode: "markers",
          type: "scatter",
          name: "perCapita (Int$)",
          marker: {
            color: "black",
            symbol: "circle"
          }
        };

        var dataplot = [trace1,trace2];

        var layout = {
          title: `Relationship of Life Expectancy and Healthcare Expenditure<br>Region: ${choice==="all"?"Worldwide":choice} in ${year}`,
          xaxis: { title: "Life Expectation (Years) ", titlefont: {colorwidth: 2, color: "black"}
                },
          yaxis: { 
            title: "Healthcare Expenditure (HE) %(GDP)",
            titlefont: {color: '#00bfd8'},
            tickfont: {color: '#00bfd8'},
          },
          yaxis2: {
            title: "HE perCapita (int$))",
            titlefont: {color: 'black'},
            tickfont: {color: 'black'},
            //anchor: 'free',
            anchor: 'x',
            overlaying: 'y',
            side: 'right'
          }
          };
        Plotly.newPlot("chart2", dataplot, layout);    
        
             
      });
    }


    function init() {
      // Grab a reference to the dropdown select element
              // Use the first sample from the list to build the initial plots
        year ="2015";
        choice ="all";
        plot(year,choice);
      };
    
    function update_continent(continent){
      console.log(continent);
      var sect = document.getElementById("year");
      var year = sect.options[sect.selectedIndex].value;
      plot(year,continent);
    }

    function update_year(year) {
      console.log(year);
      var sect = document.getElementById("continent");
      var continent = sect.options[sect.selectedIndex].value;
      plot(year,continent);
    }
    // Initialize the plot
    init();
   



//   function init() {
//     // Grab a reference to the dropdown select element
//     var selector = d3.select("#selDataset");
  
//     // Use the list of sample names to populate the select options
//     d3.json("/names").then((sampleNames) => {
//       sampleNames.forEach((sample) => {
//         selector
//           .append("option")
//           .text(sample)
//           .property("value", sample);
//       });
  
//       // Use the first sample from the list to build the initial plots
//       const firstSample = sampleNames[0];
//       buildPlots(firstSample);
//       buildMetadata(firstSample);
//     });
//   };
  
//   function optionChanged(newSample) {
//     // Fetch new data each time a new sample is selected
//     buildPlots(newSample);
//     buildMetadata(newSample);
//   };
  
//   // Initialize the dashboard
//   init();