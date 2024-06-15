import {React, useState, useEffect, useRef} from 'react'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, ListGroup, ButtonGroup, Col, Row, Tab, Tabs, Form} from 'react-bootstrap'

import useUtils from '../useUtils'
import TextareaAutosize from 'react-textarea-autosize';
import SpeechButton from '../SpeechButton'
import OpenAiWizard from '../components/OpenAiWizard'
//import SystemMessageEditorModal from '../components/SystemMessageEditorModal'
import useSystemMessageManager from '../useSystemMessageManager'
import TeamList from '../components/TeamList'
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import FileList from '../components/FileList'

import {Link } from 'react-router-dom'
import RoleList from '../components/RoleList'

export default function RolesPage(props) {

	const {user, token, login, logout, refresh, doSave, aiUsage, submitForm, stopAllPlaying, stopLanguageModels, aiLlm, usingOpenAiTts, usingSelfHostedTts, usingWebSpeechTts, usingMeSpeakTts, usingTts, usingStt, usingOpenAiStt, usingSelfHostedStt, usingLocalStt, queueSpeech, getUrl, playDataUri, stopPlaying,isPlaying,setIsPlaying, isMuted, isMutedRef, mute, unmute, category, setCategory,exportRoles,importRoles,setSystemMessage,systemMessage,setSystemConfig, systemConfig, init, saveRole, loadRole, roles, setRoles, currentRole, setCurrentRole, newRole, utteranceQueue, setUtteranceQueue, mergeData, setMergeData, lastLlmTrigger, chatHistories, setChatHistories, autoStartMicrophone, setAutoStartMicrophone, autoStopMicrophone, setAutoStopMicrophone, refreshHash, setRefreshHash, forceRefresh, hasRequiredConfig, isSpeaking, setIsSpeaking, chatHistory, setChatHistory, isWaiting, startWaiting, stopWaiting, userMessage, userMessageRef, setUserMessage, isReady, setIsReady, config, setConfig, llmEnabled, setLlmEnabled, icons, configRef, utils, currentTeam, currentTeamRef, teams, categoryFilter, setCategoryFilter} = props
	const hiddenInput = useRef()
	function iRoles(e) {
		importRoles(e)
		hiddenInput.current.value=''; 
	}
	
	let teamIndex = utils.getTeamMemberIndex(teams[currentTeam])
	
	const {openAiBillable} = utils.summariseConfig(config)
	return	<div className="App" id={refreshHash} >
		{<>
			<div id="menu" style={{zIndex:'9', backgroundColor:'lightgrey', border:'1px solid grey', position: 'fixed', top: 0, left: 0, width: '100%', height:'3em'}}  >
				
				<span style={{float:'left',marginTop:'0.2em',marginLeft:'0.2em'}} >
					<Link style={{marginLeft:'0.1em'}} to="/menu"><Button>{icons.menu}</Button></Link>
					<Link style={{marginLeft:'0.2em'}} to="/chat"><Button>{icons.chat}</Button></Link>
					<Link style={{marginLeft:'0.2em'}} to="/roles"><Button >{icons.teamlarge}</Button></Link>
					<Link style={{marginLeft:'0.2em'}} to="/settings"><Button >{icons.settings}</Button></Link>
					<Link style={{marginLeft:'0.2em'}} to="/help"><Button >{icons.question}</Button></Link>
				</span>
				
				{import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID && <span style={{float:'right',marginTop:'0.3em',marginLeft:'0.2em',marginRight:'0em'}} >	
				{(token && token.access_token) && <Button onClick={function() { logout()}} variant="danger" >{!(user && user.picture) && icons["user_logout"]} {(user && user.picture) && <img height="28" width="28" src={user.picture + '?access_token='+token.access_token + '&not-from-cache-please'} />}</Button>}
				
				{!(token && token.access_token) && <Button onClick={function() { login()}} variant="success" >{icons["user"]}</Button>}
				</span>}
				{<Link to="/tokens" ><span style={{color:'black', float:'right', marginTop:'0.7em',marginRight:'0.1em'}}> <b>{aiUsage.getTotal()}</b>
				</span></Link>}
				
			</div>
			<div id="body" style={{paddingLeft:'0.3em',paddingRight:'0.3em',textAlign:'left', zIndex:'3',position: 'relative', top: '3em', left: 0, width: '100%',  paddingTop:'0.2em', backgroundColor:'white'}}  >
				 
			<span style={{float:'right'}}>	 
				<Button style={{float:'right', marginLeft:'1em'}} variant="primary" onClick={exportRoles} >Export</Button>
				<span style={{float:'right'}} >
					<Form.Control type="file" style={{ display: 'none' }} ref={hiddenInput} onChange={iRoles} />
					<Button variant="success" as="label" htmlFor="formFile" onClick={function() {hiddenInput.current.click()}} >
					  Import
					</Button>
				</span>
			</span>
			
				 
				 <Tabs
      defaultActiveKey="roles"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="roles" title="Personas">
			<RoleList {...props} teamIndex={teamIndex}  forceRefresh={forceRefresh}  />
	  </Tab>
      <Tab eventKey="teams" title="Teams">
        <TeamList {...props} />
        
      </Tab>
      <Tab eventKey="files" title="Files">
        <FileList {...props} />
        
      </Tab>
     
    </Tabs>
    
    		</div>
			
			<div style={{position: 'fixed', bottom: 5, right:5, backgroundColor: 'white', height: '2em', width:'2em', borderRadius:'50px'}} >
				<a target='new' href="https://github.com/syntithenai/voice2llm" style={{color:'black'}}  >{icons["github"]}</a>
			</div> 
		</>}
	</div>
}