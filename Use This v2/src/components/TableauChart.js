import React, { Component } from 'react';
import tableau from 'tableau-api';


class TableauChart extends Component {
  componentDidMount() {
    this.initViz()
  }


  initViz() {
    const vizUrl = 'https://public.tableau.com/shared/H69H3DBCT?:display_count=y&:origin=viz_share_link';
    const options = {
      hideTabs: true,
      width: "1200px",
      height: "800px",
      onFirstInteractive: () => {
        console.log("it worked");
      }
    };
    const vizContainer = this.vizContainer;
    let viz = new window.tableau.Viz(vizContainer, vizUrl, options)
  }


  render() {
    return (
      <div ref={(div) => { this.vizContainer = div }}
        style={{
          position: "absolute",
          left: 130,
          top: 120
        }}>
      </div>
    )
  }
}


export default TableauChart;