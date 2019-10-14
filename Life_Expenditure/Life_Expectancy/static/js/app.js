function plot(year) {
    
    d3.csv("../data/LifeExpectancy.csv").then(function(response, err) {
      if (err) throw err;

        console.log(response);
  
  
        let data = response;

        const arrayColumn = (arr, n) => arr.map(x => x[n]);

        let country = arrayColumn(data,"Country");
        let Bothsexes15 = arrayColumn(data,"Bothsexes15");
        let E2015 = arrayColumn(data,"2015");
        let C2015 = arrayColumn(data,"2015capita")
        console.log(Bothsexes15);
        console.log(E2015);

        var hovertext1 = [];
        var hovertext2 =[];
     for (var i in country) {
       hovertext1.push(`${country[i]}<br>${E2015[i]}`);
       hovertext2.push(`${country[i]}<br>${C2015[i]}`);
     };
        var trace1 = {
          x: Bothsexes15,
          y: E2015,
          hovertext: country,
          mode: "markers",
          type: "scatter",
          name: "%(GDP)",
          marker: {
            color: "#2077b4",
            symbol: "hexagram"
          }
        };
        var trace2 = {
          x: Bothsexes15,
          y: C2015,
          hovertext:country,
          yaxis: 'y2',
          mode: "markers",
          type: "scatter",
          name: "perCapita (Int$)",
          marker: {
            color: "red",
            symbol: "circle"
          }
        };

        var dataplot = [trace1,trace2];

        var layout = {
          title: "Relationship of Life Expectancy and Healthcare Expenditure",
          xaxis: { title: "Life Expectation (Years) " },
          yaxis: { title: "Healthcare Expenditure (HE) %(GDP)" },

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
        plot()
                        



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