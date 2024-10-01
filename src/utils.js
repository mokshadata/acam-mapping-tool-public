import assignments from '../data/assignments.json'
import services from '../data/services.json'

  export function groupByPartners() {
    const servicesMap = services.reduce((acc, { partner, service, program_area }) => {
        if (!acc[partner]) {
            acc[partner] = [];
        }
        acc[partner].push({ service, program_area });
        return acc;
    }, {});

    const zipcodesMap = assignments.reduce((acc, { partner, zip_code }) => {
        if (!acc[partner]) {
            acc[partner] = [];
        }
        acc[partner].push(zip_code);
        return acc;
    }, {});

    
    const groupedAssignments = {};

    assignments.forEach(item => {
        const { partner, zip_restricted, is_winner } = item;

        if (!groupedAssignments[partner]) {
            groupedAssignments[partner] = {};
            groupedAssignments[partner].partner= partner;
            groupedAssignments[partner].zip_restricted= zip_restricted
            groupedAssignments[partner].is_winner= is_winner
        }

    });

    const merged = Object.values(groupedAssignments).map(object=> {
        const { partner } = object
        return {
            ...object,
            services: servicesMap[partner] || [],
            zipcodes: zipcodesMap[partner] || []
        }
    }).sort((a, b) => a.partner.localeCompare(b.partner));

    return merged


}






	



