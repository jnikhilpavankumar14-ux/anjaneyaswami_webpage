import PujaSchedule from '@/components/PujaSchedule'
import TempleHistory from '@/components/TempleHistory'
import Founders from '@/components/Founders'
import MissionStatement from '@/components/MissionStatement'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-saffron mb-4">
          Sri Abhayanjaneya Swamy Temple
        </h1>
        <p className="text-2xl text-gray-700">Gandlapalli</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <TempleHistory />
        <MissionStatement />
      </div>

      <Founders />

      <div className="mt-12">
        <PujaSchedule />
      </div>
    </div>
  )
}

