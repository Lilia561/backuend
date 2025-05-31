import React from 'react';
import styles from './TransferWrapperComp.module.css';
import GcashTransferComp from '../GCashTransferComp/GcashTransferComp';
import PaymayaTransferComp from '../PayMayaTransferComp/PayMayaTransferComp';
import BancNetTransferComp from '../BancNetTransferComp/BancNetTransferComp';
import { useNavigate } from 'react-router-dom';

function TransferWrapperComp() {
  const navigate = useNavigate();
  return (
    <div className={styles.dashboardRoot}>
      <div className={styles.authWrapper}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ←Back
        </button>
        <div className={styles.transferWrapperContainer}>
          <GcashTransferComp />
          <PaymayaTransferComp />
          <BancNetTransferComp />
        </div>
      </div>
    </div>
  );
}

export default TransferWrapperComp;
