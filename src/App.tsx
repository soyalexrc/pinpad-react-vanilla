import {PinPad, PinPadClient} from '@placetopay/pinpad-sdk';
import {useEffect, useState} from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const URL = 'https://pinpad-dev.placetopay.ws'
// const URL = 'https://pinpad-UAT.placetopay.ws'
const TOKEN = '189|KB38AU9OTgMORAIcrihdy5HP2yTduHsfVTxHh1Em'

function App() {
const [transactionId, setTransactionId] = useState<string>('')


    const pinpad = new PinPad({
        mode: 'static'
    });
    const client = new PinPadClient(URL, TOKEN)


    async function createTransaction() {
        try {
            const response = await client.createTransaction();
            const positions = response.data.data.positions.split('').join(',')
            await pinpad.render('#pinpad-render', positions);
            setTransactionId(response.data.data.transactionId)
        } catch (error) {
            console.error(error);
        }
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.target as HTMLFormElement
        const formData = new FormData(form);
        const pin = formData.get('pin') as string;

        const format = 0;
        const data = {
            transactionId,
            format,
            pin,
            pan: 1234010293091,
        }


        client.generatePinBlock(data)
            .then(res => {
                console.log(res);
                // this.flashPaymentService.controller.pinBlock = res.data.data.pinblock;
                // this.flashPaymentService.stepUpdate(2)
            }).catch(err => {
            console.log('catch', err)
        })

        if (pin) {
            console.log('PIN Submitted:', pin);
        } else {
            console.error('No PIN received');
        }
    }

    useEffect(() => {
        createTransaction();
    }, [])


    return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
        <form onSubmit={onSubmit}>
            <div id="pinpad-render"></div>
            <button className="btn btn-danger btn-lg" type="submit">Continuar</button>
        </form>

    </>
  )
}

export default App
