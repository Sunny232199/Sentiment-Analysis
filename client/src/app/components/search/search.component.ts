import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Data } from '../../model/data';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  busy: Subscription;
  searchStr: string;

  title = 'Twitter Sentiment Analysis';
  searchquery = '';
  tweetsdata;
  data: Data[] = [];
  chart = [];
  statusMessage = 'Loading Tweets...';
  constructor(private http: Http) { }

  searchcall() {
    if (this.searchquery.length === 0) {
      return;
    }
    const searchterm = 'query=' + this.searchquery;
    const headers = new Headers();
    const _headers = new Headers();
    const pieChartData = [];

    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    this.http.post('http://localhost:3000/authorize', { headers: headers }).subscribe((res) => {

      _headers.append('Content-Type', 'application/X-www-form-urlencoded');
      this.busy =
        this.http.post('http://localhost:3000/timeline', searchterm, { headers: _headers }).subscribe((_res) => {
          this.tweetsdata = _res.json().data;
          for (let i = 0; i < this.tweetsdata.length; i++) {
            const sc = this.tweetsdata[i].sentiment.score;
            pieChartData.push(sc);
          }

          const groupedData: any[] = this.groupBy(pieChartData);
          this.data = [];

          for (let i = 0; i < Object.keys(groupedData).length; i++) {
            const sc = Object.values(groupedData)[i][0];
            const con = (Object.values(groupedData)[i]).length;
            this.data.push({ amount: con, category: sc });
          }

          this.data.sort(function (a, b) { return a.category - b.category; });
          this.removeData(this.chart);
          this.chart = new Chart('myChart', {
            type: 'bar',
            data: {
              labels: this.data.map(x => x.category),
              xAxisId: 'Score',
              yAxisId: 'Tweets',
              datasets: [
                {
                  data: this.data.map(x => x.amount),
                  borderColor: '#ffcc00',
                  fill: true,
                  backgroundColor: '#f4f7f5'
                }
              ]
            },
            options: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Sentiment Analysis of ' + this.searchquery + ' on Twitter.'
              },
              scales: {
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Sentiment Scores',
                    fontSize: 25
                  }
                }],
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Tweets',
                    fontSize: 25
                  }
                }],
              },
              maintainAspectRatio: false
            }
          });
        }, (error) => {
          this.statusMessage = 'Failed to get Tweets.';
        });
    }
    );
  }
  groupBy(xs) {
    return xs.reduce(function (rv, x) {
      (rv[x] = rv[x] || []).push(x);
      return rv;
    }, {});

  }

  removeData(chart) {
    if (chart.data !== undefined) {
      chart.data.labels = [];
      chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
      });
      chart.update();
    }
  }
}
