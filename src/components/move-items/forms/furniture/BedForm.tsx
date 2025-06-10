import React, { useState } from 'react'

export default function BedForm() {
  const [type, setType] = useState('');
  const [frame, setFrame] = useState('');
  const [note, setNode] = useState('');

  const types = ['접이식 침대', '싱글/슈퍼싱글', '더블', '퀸', '킹'];
  const frames = ['프레임 없음', '일반 프레임', '통프레임', '서랍/수납형', '2층/벙커침대'];
  
  return (
    <div>
      <div className='px-4'>
        <h2 className='text-lg font-semibold mb-4'>침대 상세 입력</h2>
      </div>
    </div>
  )
}
