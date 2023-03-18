import Identicon from "react-identicons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { truncate, useGlobalState, daysRemaining } from "../store";
import { payoutBeneficiary } from "../Blockchain.services";
import { toast } from "react-toastify";

const Proposals = () => {
  const [data] = useGlobalState("proposals");
  const [proposals, setProposals] = useState(data);

  const deactivate = `bg-transparent
    text-blue-600 font-medium text-xs leading-tight
    uppercase hover:bg-blue-700 focus:bg-blue-700
    focus:outline-none focus:ring-0 active:bg-blue-600
    transition duration-150 ease-in-out overflow-hidden
    border border-blue-600 hover:text-white focus:text-white`;

  const active = `bg-blue-600
    text-white font-medium text-xs leading-tight
    uppercase hover:bg-blue-700 focus:bg-blue-700
    focus:outline-none focus:ring-0 active:bg-blue-800
    transition duration-150 ease-in-out overflow-hidden
    border border-blue-600`;

  const getAll = () => setProposals(data);

  const getOpened = () =>
    setProposals(
      data.filter(
        (proposal) => new Date().getTime() < Number(proposal.duration + "000")
      )
    );

  const getClosed = () =>
    setProposals(
      data.filter(
        (proposal) => new Date().getTime() > Number(proposal.duration + "000")
      )
    );

  return (
    <div className="flex flex-col p-8">
      <div className="flex flex-row justify-center items-center" role="group">
        <button
          aria-current="page"
          className={`rounded-l-full px-6 py-2.5 ${active}`}
          onClick={getAll}
        >
          All
        </button>
        <button
          aria-current="page"
          className={`px-6 py-2.5 ${deactivate}`}
          onClick={getOpened}
        >
          Open
        </button>
        <button
          aria-current="page"
          className={`rounded-r-full px-6 py-2.5 ${deactivate}`}
          onClick={getClosed}
        >
          Closed
        </button>
      </div>
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="h-[calc(100vh_-_20rem)] overflow-y-auto shadow-md rounded-md">
            <table className="min-w-full">
              <thead className="border-b dark:border-gray-500">
                <tr>
                <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Created By
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Beneficiary
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Expires
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal, i) => (
                    <Proposal key={i} proposal={proposal} />
                ))}  
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const Proposal = ({ proposal }) => {
    const handlePayout = async () => {
        await payoutBeneficiary(proposal.id)
        toast.success("Beneficiary Successfully Paid Out!")
    } 
    return (
        <tr
        className="border-b dark:border-gray-500"
        >
            <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                <div className="flex flex-row justify-start items-center space-x-3">
                    <Identicon
                        string={proposal.proposer.toLowerCase()}
                        size={25}
                        className="h-10 w-10 object-contain rounded-full mr-3"
                    />
                    <span>{truncate(proposal.proposer, 4, 4, 11)}</span>
                </div>
            </td>
            <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                <div className="flex flex-row justify-start items-center space-x-3">
                    <Identicon
                        string={proposal.beneficiary.toLowerCase()}
                        size={25}
                        className="h-10 w-10 object-contain rounded-full mr-3"
                    />
                    <span>{truncate(proposal.beneficiary, 4, 4, 11)}</span>
                </div>
            </td>
            <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                {proposal.title.substring(0, 80) + "..."}
            </td>
            <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                {new Date().getTime() > Number(proposal.duration + "000")
                ? "Expired"
                : daysRemaining(proposal.duration)}
            </td>
            <td>
                {new Date().getTime() >
                Number(proposal.duration + '000') ? (
                    proposal.upvotes > proposal.downvotes ? (
                    !proposal.paid ? (
                        <button
                        className="bg-transparent px-4 py-2.5 font-medium leading-tight uppercase text-yellow-600 text-xs rounded-full shadow-md shadow-gray-400 active:bg-yellow-800 dark:shadow-transparent transition duration-150 ease-in-out dark:border dark:border-yellow-500 border border-yellow-600 hover:text-white hover:bg-yellow-600"
                        onClick={() => handlePayout(proposal.id)}
                        >
                        Payout
                        </button>
                    ) : (
                        <button
                        className="bg-transparent px-4 py-2.5 font-medium leading-tight uppercase text-green-600 text-xs rounded-full shadow-md shadow-gray-400 active:bg-green-800 dark:shadow-transparent transition duration-150 ease-in-out dark:border dark:border-green-500 border border-green-600 hover:text-white hover:bg-green-600"
                        >
                        Paid
                        </button>
                    )
                    ) : (
                    <button
                        className="bg-transparent px-4 py-2.5 font-medium leading-tight uppercase text-red-600 text-xs rounded-full shadow-md shadow-gray-400 active:bg-red-800 dark:shadow-transparent transition duration-150 ease-in-out dark:border dark:border-red-500 border border-red-600 hover:text-white hover:bg-red-600"
                        >
                        Rejected
                        </button>
                    )
                ) : null}
            </td>
            <td className="flex justify-start items-center space-x-3 text-sm font-light px-6 py-4 whitespace-nowrap">
                <Link
                to={"/proposal/" + proposal.id}
                className="bg-blue-600 px-4 py-2.5 font-medium text-sm leading-light uppercase text-white shadow-md shadow-gray-400 active:bg-blue-800 dark:shadow-transparent transition duration-150 ease-in-out dark:border dark:border-blue-500 border border-blue-600 hover:text-white rounded-full"
                >
                View
                </Link>
            </td>
        </tr>
    )
}

export default Proposals;
