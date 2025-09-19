import { ethers } from "ethers";
import { useState } from "react";

export default function Home() {
  const [minhaCarteira, setMinhaCarteira] = useState("");
  const [saldo, setSaldo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enderecoDestino, setEnderecoDestino] = useState("");
  const [quantidade, setQuantidade] = useState("");
  
  async function btnConnectClick() {
     if (!window.ethereum) return setMensagem("Metamask não detectado");
     setMensagem("Tentando conectar a carteira e carregando saldo...");
     
     const provider = new ethers.BrowserProvider(window.ethereum);
     const contas = await provider.send('eth_requestAccounts');
     console.log(contas);
     if (!contas || !contas.length) throw new Error("Nenhuma conta Metamask permitido");
   
     const chainId = await window.ethereum.request({ method: 'eth_chainId' });
     if (chainId !== '0xaa36a7') {
       alert('Por favor, conecte-se à rede Sepolia na MetaMask.');
     }

     const balance = await provider.getBalance(minhaCarteira);
     const rede = await provider.getNetwork(minhaCarteira);
     setSaldo(ethers.formatEther(balance.toString()));
     console.log(rede);
     setMensagem('');
  }

  async function btnTransferenciaClick() {
    setMensagem(`Tentando transferir ${quantidade} ETHs para ${enderecoDestino}...`);
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const transacao = await signer.sendTransaction({
      to: enderecoDestino,
      value: ethers.parseEther(quantidade)
    });
    await transacao.wait();

    setMensagem("Tx HASH: " + transacao.hash);
  }
  
  return (
    <>
        <div>
          <p>
            Minha Carteira: <input type="text" onChange={evt => setMinhaCarteira(evt.target.value)} />
            <input type="button" value="Conectar!" onClick={btnConnectClick} />
          </p>
          <p>
            Saldo (ETH): {saldo}
          </p>
          <br />
        </div>
        <div>
           <p>
             Conta Destino: <input type="text" onChange={evt=>setEnderecoDestino(evt.target.value)}></input>
           </p>
           <p>
             Quantidade(ETH): <input type="text" onChange={evt=>setQuantidade(evt.target.value)}></input>
           </p>
           <p>
            <input type="button" value="Transferir" onClick={btnTransferenciaClick}></input>
           </p>
          <p>
            <br />
            {mensagem}
          </p>
        </div>
    </>

    
  );
}
