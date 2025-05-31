import React from 'react';
import './TransferWrapperComp.css';
import GcashTransferComp from '../GCashTransferComp/GcashTransferComp';
import PaymayaTransferComp from '../PayMayaTransferComp/PayMayaTransferComp';
import BancNetTransferComp from '../BancNetTransferComp/BancNetTransferComp';

function TransferWrapperComp() {
  return (
    <div className="transfer-wrapper-container">
      <GcashTransferComp />
      <PaymayaTransferComp />
      <BancNetTransferComp />
    </div>
  );
}

export default TransferWrapperComp;