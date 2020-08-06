function newSessionFunctions() {
    thisObject = {
        runSession: runSession,
        stopSession: stopSession
    }

    return thisObject

    function runSession(node, functionLibraryProtocolNode, functionLibraryDependenciesFilter, resume, callBackFunction) {
        if (validations(node) !== true) {
            callBackFunction(GLOBAL.DEFAULT_FAIL_RESPONSE)
            return
        }

        let networkNode = node.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode
        let eventsServerClient = canvas.designSpace.workspace.eventsServerClients.get(networkNode.id)

        node.payload.uiObject.run(eventsServerClient, callBackFunction)

        let key = node.name + '-' + node.type + '-' + node.id

        let lightingPath = '' +
            'Trading System->' +
            'Parameters->' +
            'Base Asset->Quoted Asset->Time Range->Time Frame->Slippage->Fee Structure->' +
            'Exchange Account Asset->Asset->' +
            'Trading Strategy->' +
            'Trigger Stage->Trigger On Event->Trigger Off Event->Take Position Event->' +
            'Announcement->Announcement Formula->' +
            'Open Stage->' +
            'Initial Definition->Initial Stop->Initial Take Profit->' +
            'Manage Stage->' +
            'Managed Stop Loss->Managed Take Profit->' +
            'Phase->Formula->Next Phase Event->Move To Phase Event->Phase->' +
            'Situation->Condition->Javascript Code->' +
            'Close Stage->' +
            'Initial Targets->Target Size In Base Asset->Target Size In Quoted Asset->Target Rate->Formula->' +
            'Announcement->Announcement Formula->' +
            'Open Execution->Close Execution->' +
            'Execution Algorithm->Market Buy Order->Market Sell Order->Limit Buy Order->Limit Sell Order->' +
            'Create Order Event->Cancel Order Event->' +
            'Size In Base Asset->Size In Quoted Asset->Position Rate->Formula->' +
            'Situation->Condition->Javascript Code->' +
            'Market Order->Limit Order->' +
            'Simulated Exchange Events->Simulated Partial Fill->Simulated Actual Rate->Simulated Fees Paid->Formula->'

        let tradingSystem = functionLibraryProtocolNode.getProtocolNode(node.tradingSystemReference.payload.referenceParent, false, true, true, false, false, lightingPath)

        lightingPath = '' +
            'Trading Engine->' +
            'Dynamic Indicators->Indicator Function->Formula->' +
            'Episode->Current->Last->Previous->' +
            'Episode Base Asset->Episode Quoted Asset->Episode Counters->Episode Statistics->' +
            'Periods->Strategies->Positions->Orders->Hits->Fails->' +
            'Profit Loss->Hit Ratio->Hit Fail->Days->ROI->Anualized Rate Of Return->User Defined Statistic->' +
            'Formula->' +
            'Candle->' +
            'Begin->End->Open->Close->Min->Max->Index->' +
            'Balance->Base Asset->Quoted Asset->' +
            'Distance To Event->' +
            'Trigger On->Trigger Off->Take Position->Close Position->Next Phase->Move To Phase->Create Order->Cancel Order->Close Order->' +
            'Strategy->' +
            'Serial Number->Identifier->Begin->End->Strategy Name->Index->Status->Begin Rate->End Rate->Situation Name->' +
            'Strategy Counters->Periods->' +
            'Position->' +
            'Serial Number->Identifier->Begin->End->Entry Target Rate->Exit Target Rate->Exit Type->Status->Begin Rate->End Rate->Situation Name->' +
            'Stop Loss->Stop Loss Stage->Stop Loss Phase->Stop Loss Position->' +
            'Take Profit->Take Profit Stage->Take Profit Phase->Take Profit Position->' +
            'Position Counters->Periods->' +
            'Position Statistics->Days->User Defined Statistic->' +
            'Position Base Asset->Position Quoted Asset->Entry Target Size->Exit Target Size->' +
            'Profit Loss->ROI->Hit Fail->' +
            'Formula->' +
            'Exchange Orders->Market Buy Orders->Market Sell Orders->Limit Buy Orders->Limit Sell Orders->' +
            'Market Order->Limit Order->' +
            'Serial Number->Identifier->Exchange Id->Begin->End->Rate->Exit Type->Status->Order Name->Algorithm Name->Situation Name->Lock->' +
            'Order Counters->Periods->' +
            'Order Base Asset->Order Quoted Asset->' +
            'Size->Size Filled->Fees Paid->' +
            'Order Statistics->Percentage Filled->Actual Rate->Days->User Defined Statistic->' +
            'Strategy Trigger Stage->Strategy Open Stage->Strategy Manage Stage->Strategy Close Stage->' +
            'Begin->End->Exit Type->Status->Begin Rate->End Rate->Stage Base Asset->Stage Quoted Asset->Size Placed->Target Size->Size Filled->Fees Paid->'

        let tradingEngine = functionLibraryProtocolNode.getProtocolNode(node.tradingEngineReference.payload.referenceParent, false, true, true, false, false, lightingPath)

        lightingPath = '' +
            'Backtesting Session->Paper Trading Session->Fordward Testing Session->Live Trading Session->' +
            'Parameters->' +
            'Session Base Asset->Session Quoted Asset->Time Range->Time Frame->Slippage->Fee Structure->Snapshots->User Defined Parameters->' +
            'Exchange Account Asset->Asset->' +
            'Social Bots->Telegram Bot->'

        let session = functionLibraryProtocolNode.getProtocolNode(node, false, true, true, false, false, lightingPath)

        let dependencyFilter = functionLibraryDependenciesFilter.createFilter(node.tradingSystemReference.payload.referenceParent)

        /* Raise event to run the session */
        let event = {
            appSchema: JSON.stringify(APP_SCHEMA_ARRAY),
            session: JSON.stringify(session),
            tradingSystem: JSON.stringify(tradingSystem),
            tradingEngine: JSON.stringify(tradingEngine),
            dependencyFilter: JSON.stringify(dependencyFilter),
            resume: resume
        }

        eventsServerClient.raiseEvent(key, 'Run Session', event)

        if (node.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode === undefined) {
            callBackFunction(GLOBAL.DEFAULT_FAIL_RESPONSE)
            return
        }
    }

    function stopSession(node, functionLibraryProtocolNode, callBackFunction) {
        if (validations(node) !== true) {
            callBackFunction(GLOBAL.DEFAULT_FAIL_RESPONSE)
            return
        }

        let networkNode = node.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode
        let eventsServerClient = canvas.designSpace.workspace.eventsServerClients.get(networkNode.id)

        let key = node.name + '-' + node.type + '-' + node.id
        eventsServerClient.raiseEvent(key, 'Stop Session')

        node.payload.uiObject.stop(callBackFunction)
    }

    function validations(node) {
        if (node.payload.parentNode === undefined) {
            node.payload.uiObject.setErrorMessage('Session needs a Process Instance parent to be able to run.')
            return
        }

        if (node.payload.parentNode.payload.parentNode === undefined) {
            node.payload.uiObject.setErrorMessage('Session needs to be inside a Trading Process Instance.')
            return
        }

        if (node.payload.parentNode.payload.parentNode.payload.parentNode === undefined) {
            node.payload.uiObject.setErrorMessage('Session needs to be inside a Task.')
            return
        }

        if (node.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode === undefined) {
            node.payload.uiObject.setErrorMessage('Session needs to be inside a Task Manager.')
            return
        }

        if (node.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode === undefined) {
            node.payload.uiObject.setErrorMessage('Session needs to be inside Exchange Tasks.')
            return
        }

        if (node.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode === undefined) {
            node.payload.uiObject.setErrorMessage('Session needs to be inside a Testing or Production Environment.')
            return
        }

        if (node.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode.payload.parentNode === undefined) {
            node.payload.uiObject.setErrorMessage('Session needs to be inside a Network Node.')
            return
        }

        if (node.payload.parentNode.payload.uiObject.isRunning !== true) {
            node.payload.uiObject.setErrorMessage('Session needs a Process Instance parent to be running.')
            return
        }

        if (node.tradingSystemReference === undefined) {
            node.payload.uiObject.setErrorMessage('Session needs a child Trading System Reference.')
            return
        }

        if (node.tradingEngineReference === undefined) {
            node.payload.uiObject.setErrorMessage('Session needs a child Trading Engine Reference.')
            return
        }

        if (node.tradingSystemReference.payload.referenceParent === undefined) {
            node.payload.uiObject.setErrorMessage('Trading System Reference needs to reference a Trading System.')
            return
        }

        if (node.tradingEngineReference.payload.referenceParent === undefined) {
            node.payload.uiObject.setErrorMessage('Trading Engine Reference needs to reference a Trading Engine.')
            return
        }
        return true
    }
}
