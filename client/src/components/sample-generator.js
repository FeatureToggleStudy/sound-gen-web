import React, { Component } from 'react'
import { observer } from 'mobx-react'
import * as mm from '@magenta/music'

import { MDBIcon } from 'mdbreact'
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'
import { MDBBtn } from 'mdbreact'

import VisualizerLines from './visualizer-lines'

const model = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/trio_4bar')
const player = new mm.Player()

const style = {
  wrapper: {
		border: '1px solid black',
		height: '250px',
		width: 'auto',
		padding: '15px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: '30px'
  }
}

class SampleGenerator extends Component {

	config = {
		generateOnLoad: false
	}

  constructor(props) {
		super(props)
		this.state = {
			sampleVisualizationData: null,
			sample: null,
			isPlaying: false,
			isSampleCreated: false,
			isSampleGenerating: false,
			loading: true
		}
	}

  generateSample() {
		const numSamples = 1
		this.setState({isSampleGenerating:true})
		this.stopTrack()
		setTimeout(() => {
			model.sample(numSamples)
			.then(samples => {
				const chosenSample = samples[0]
				this.setState({isSampleGenerating:false})
				this.setState({sample:chosenSample})
				this.props.observable.samples[this.props.id] = chosenSample
				this.setState({isSampleCreated:true})
			})
		}, 200)
  }

  componentDidMount() {
		model
			.initialize()
			.then(() => {
				this.setState({loading:false})
				if (this.config.generateOnLoad === true) {
					this.generateSample()
				}
			})
	}

	dislikeTrack() {

  }

  likeTrack() {

  }
	
	stopTrack() {
		player.stop()
    this.setState({isPlaying: false})
  }

  playTrack() {
		const sample = this.state.sample
		this.setState({isPlaying: true})

    player.start(sample).then(() => {
      this.setState({isPlaying: false})
    })
  }

  render() {

	let loading = <div className="loader border-top-default fast small"></div>

	let content = 

	  <MDBContainer>
			<MDBRow>
				<MDBCol sm="12">
					<MDBBtn 
						color={ this.state.isSampleGenerating ? 'mdb-color' : 'primary'} 
						disabled={this.state.isSampleGenerating}
						outline
						onClick={this.generateSample.bind(this)} 
					>
					{ this.state.isSampleGenerating ? 'Generating...' : 'Generate Sample'  }		
					</MDBBtn>
				</MDBCol>
			</MDBRow>
			<MDBRow className='mt-3'>
				<MDBCol sm="12">
					<VisualizerLines 
						sample={this.state.sample}
						observable={this.props.observable}
					/>
				</MDBCol>
			</MDBRow>
			<MDBRow className='mt-3'>
				<MDBCol sm="4">
					<MDBBtn 
							color={ !this.state.isSampleCreated ? 'mdb-color' : 'danger'} 
							outline
							disabled={!this.state.isSampleCreated}
							onClick={this.dislikeTrack.bind(this)} 
						>
							<MDBIcon icon="thumbs-o-down" />
					</MDBBtn>
				</MDBCol>
				<MDBCol sm="4">
				{
					this.state.isPlaying
					? (
						<MDBBtn 
							color={ !this.state.isSampleCreated ? 'mdb-color' : 'secondary'} 
							outline
							disabled={!this.state.isSampleCreated}
							onClick={this.stopTrack.bind(this)} 
						>
							<MDBIcon icon="stop" />
						</MDBBtn>
					)
					// not playing
					: (
						<MDBBtn 
							color={ !this.state.isSampleCreated ? 'mdb-color' : 'primary'} 
							outline
							disabled={!this.state.isSampleCreated}
							onClick={this.playTrack.bind(this)} 
						>
							<MDBIcon icon="play" />
						</MDBBtn>
					)
				}
				</MDBCol>
				<MDBCol sm="4">
            <MDBBtn 
							color={ !this.state.isSampleCreated ? 'mdb-color' : 'success'} 
							outline
							disabled={!this.state.isSampleCreated}
              onClick={this.likeTrack.bind(this)} 
            >
              <MDBIcon icon="thumbs-o-up" />
            </MDBBtn>
          </MDBCol>
			</MDBRow>
		</MDBContainer>

	return (
		<div style={style.wrapper}>
		  {
			this.state.loading
			? (
			  loading
			)
			: (
			  content
			)
		  }
		</div>
	)
  }
}

export default observer(SampleGenerator)
